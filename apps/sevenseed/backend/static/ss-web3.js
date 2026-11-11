/**
 * Sevenseed Web3 helpers (window.SSWeb3). Everything here is real:
 *  - fingerprint(): SHA-256 of a file or text, computed in the browser (nothing is uploaded)
 *  - connect() / switchChain(): the visitor's own wallet (MetaMask or any EIP-1193 wallet)
 *  - sign(): a free wallet signature over the fingerprint (no transaction, no gas)
 *  - anchor(): a 0-value transaction from the wallet to itself carrying the fingerprint, so
 *    the proof is public on chain (the visitor pays the network fee and confirms in the wallet)
 *  - status() / lookupTx(): live chain reads via the Sevenseed backend
 * Sevenseed never holds keys and has no smart contracts deployed.
 */
(function () {
  "use strict";
  if (window.SSWeb3) return;

  var CHAINS = {
    ethereum: { name: "Ethereum", chainId: 1, hex: "0x1", symbol: "ETH", explorer: "https://etherscan.io", rpc: "https://eth.drpc.org" },
    polygon: { name: "Polygon PoS", chainId: 137, hex: "0x89", symbol: "POL", explorer: "https://polygonscan.com", rpc: "https://polygon-rpc.com" },
    base: { name: "Base", chainId: 8453, hex: "0x2105", symbol: "ETH", explorer: "https://basescan.org", rpc: "https://mainnet.base.org" },
    arbitrum: { name: "Arbitrum One", chainId: 42161, hex: "0xa4b1", symbol: "ETH", explorer: "https://arbiscan.io", rpc: "https://arb1.arbitrum.io/rpc" },
  };

  function hex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function fingerprint(input) {
    var data;
    if (typeof input === "string") data = new TextEncoder().encode(input);
    else if (input && typeof input.arrayBuffer === "function") data = await input.arrayBuffer();
    else data = input;
    return hex(await crypto.subtle.digest("SHA-256", data));
  }

  function provider() {
    return window.ethereum && typeof window.ethereum.request === "function" ? window.ethereum : null;
  }

  function friendly(err) {
    var code = err && (err.code || (err.data && err.data.code));
    if (code === 4001 || code === "ACTION_REJECTED") return "You cancelled it in your wallet.";
    if (code === -32002) return "Your wallet already has a request waiting. Open the wallet and finish or cancel it.";
    var msg = (err && (err.message || err.reason)) || String(err);
    if (/insufficient funds/i.test(msg)) return "Your wallet doesn't have enough on this network to pay the fee.";
    return msg.slice(0, 220);
  }

  async function connect() {
    var p = provider();
    if (!p) throw new Error("No wallet found. Install MetaMask (or open this page in your wallet app's browser) and try again.");
    try {
      var accounts = await p.request({ method: "eth_requestAccounts" });
      var chainHex = await p.request({ method: "eth_chainId" });
      return { address: accounts[0], chainId: parseInt(chainHex, 16), chain: chainKeyFor(parseInt(chainHex, 16)) };
    } catch (e) {
      throw new Error(friendly(e));
    }
  }

  function chainKeyFor(id) {
    for (var k in CHAINS) if (CHAINS[k].chainId === id) return k;
    return null;
  }

  async function switchChain(key) {
    var p = provider(), c = CHAINS[key];
    if (!p || !c) throw new Error("No wallet or unknown network.");
    try {
      await p.request({ method: "wallet_switchEthereumChain", params: [{ chainId: c.hex }] });
    } catch (e) {
      if (e && e.code === 4902) {
        await p.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: c.hex, chainName: c.name, nativeCurrency: { name: c.symbol, symbol: c.symbol, decimals: 18 }, rpcUrls: [c.rpc], blockExplorerUrls: [c.explorer] }],
        });
      } else throw new Error(friendly(e));
    }
  }

  function proofMessage(hash, label) {
    return "Sevenseed proof of existence\nSHA-256: " + hash + (label ? "\nLabel: " + label : "") + "\nSigned at: " + new Date().toISOString();
  }

  async function sign(hash, label) {
    var acct = await connect();
    var message = proofMessage(hash, label);
    var msgHex = "0x" + hex(new TextEncoder().encode(message));
    try {
      var signature = await provider().request({ method: "personal_sign", params: [msgHex, acct.address] });
      return { type: "sevenseed-signed-proof", version: 1, sha256: hash, label: label || "", message: message, address: acct.address, signature: signature };
    } catch (e) {
      throw new Error(friendly(e));
    }
  }

  async function anchor(hash, key) {
    var acct = await connect();
    if (acct.chain !== key) await switchChain(key);
    try {
      var tx = await provider().request({
        method: "eth_sendTransaction",
        params: [{ from: acct.address, to: acct.address, value: "0x0", data: "0x" + hash }],
      });
      var c = CHAINS[key];
      return { type: "sevenseed-chain-proof", version: 1, sha256: hash, chain: key, network: c.name, address: acct.address, tx_hash: tx, explorer_url: c.explorer + "/tx/" + tx };
    } catch (e) {
      throw new Error(friendly(e));
    }
  }

  async function getJSON(url) {
    var r = await fetch(url, { headers: { accept: "application/json" } });
    var body = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(body.detail || "Request failed (" + r.status + ")");
    return body;
  }

  function status() { return getJSON("/api/web3/telemetry"); }

  function lookupTx(key, txHash, expectHash) {
    return getJSON("/api/web3/tx?chain=" + encodeURIComponent(key) + "&hash=" + encodeURIComponent(txHash.trim()) + "&expect=" + encodeURIComponent(expectHash || ""));
  }

  // Signature check needs secp256k1 recovery; load ethers only when someone verifies.
  var ethersPromise = null;
  function loadEthers() {
    if (window.ethers) return Promise.resolve(window.ethers);
    if (!ethersPromise) {
      ethersPromise = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js";
        s.onload = function () { resolve(window.ethers); };
        s.onerror = function () { ethersPromise = null; reject(new Error("Couldn't load the signature checker. Check your connection.")); };
        document.head.appendChild(s);
      });
    }
    return ethersPromise;
  }

  async function verifySignature(proof) {
    var ethers = await loadEthers();
    var recovered = ethers.verifyMessage(proof.message, proof.signature);
    var hashInMessage = (proof.message.match(/SHA-256: ([0-9a-f]{64})/) || [])[1];
    return { signer: recovered, signerMatches: recovered.toLowerCase() === String(proof.address).toLowerCase(), hash: hashInMessage };
  }

  function short(a) { return a ? a.slice(0, 6) + "…" + a.slice(-4) : ""; }

  window.SSWeb3 = { CHAINS: CHAINS, fingerprint: fingerprint, hasWallet: function () { return !!provider(); }, connect: connect, switchChain: switchChain, sign: sign, anchor: anchor, status: status, lookupTx: lookupTx, verifySignature: verifySignature, short: short };
})();
