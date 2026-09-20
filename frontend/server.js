const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = parseInt(process.env.PORT || "3001", 10);
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8"
};

const ALIASES = {
  "/pharmacy": "/decode-forest-pharmacy",
  "/breakdown": "/breakdown-factor",
  "/trust": "/avp-charitable-trust",
  "/comonk-ai": "/comonk"
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 Not Found</h1><p>Sevenseed Platform Resource Missing</p>");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600"
    });
    res.end(data);
  });
}

function handleAPI(req, res, pathname) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    let payload = {};
    try {
      if (body) payload = JSON.parse(body);
    } catch (e) {}

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    });

    if (pathname === "/api/contact") {
      console.log("[Node.js API /api/contact]:", payload);
      res.end(JSON.stringify({ success: true, message: "Contact inquiry recorded in Sevenseed Engine." }));
    } else if (pathname === "/api/tools/evaluate" || pathname === "/api/ideate") {
      const name = payload.name || "Venture";
      const sector = payload.sector || "AI Technology";
      res.end(JSON.stringify({
        success: true,
        venture: name,
        score: 88,
        verdict: "High Potential Studio Fit",
        tam: "$18.5B TAM",
        synergy: `Strong alignment with Sevenseed's shared LangGraph & Groq infrastructure in ${sector}.`,
        next_steps: ["Refine ICP definition", "Launch prototype on port 8000+"]
      }));
    } else if (pathname === "/api/counsel") {
      res.end(JSON.stringify({
        success: true,
        advice: "Prioritize customer discovery over headcount expansion. Focus on 10 committed design partners.",
        action_items: ["Validate WTP with 15 customer calls", "Ship zero-margin BYOK architecture"]
      }));
    } else if (pathname === "/api/bns-lookup") {
      res.end(JSON.stringify({
        success: true,
        section: "Section 304 BNS",
        desc: "Snatching property with use of sudden physical force.",
        cognizable: true
      }));
    } else if (pathname === "/api/tools/boq" || pathname === "/api/boq-calculate") {
      res.end(JSON.stringify({
        success: true,
        subtotal: 1450000,
        contractor_profit: 217500,
        gst: 299700,
        grand_total: 1967200
      }));
    } else if (pathname === "/api/tax-80g") {
      const amt = Number(payload.amount) || 10000;
      res.end(JSON.stringify({
        success: true,
        receiptId: `10BE-${Date.now()}`,
        donationAmount: amt,
        eligibleDeduction: Math.round(amt * 0.5)
      }));
    } else {
      res.end(JSON.stringify({ success: true, status: "Sevenseed Node.js Service Operational" }));
    }
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  let pathname = parsed.pathname || "/";

  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  // Handle Node.js APIs
  if (pathname.startsWith("/api/")) {
    handleAPI(req, res, pathname);
    return;
  }

  // Check Aliases
  for (const [prefix, target] of Object.entries(ALIASES)) {
    if (pathname === prefix) {
      pathname = target;
      break;
    } else if (pathname.startsWith(prefix + "/")) {
      pathname = target + pathname.slice(prefix.length);
      break;
    }
  }

  // Map to Public File
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, "");
  if (safePath.startsWith("/") || safePath.startsWith("\\")) {
    safePath = safePath.slice(1);
  }

  let filePath = path.join(PUBLIC_DIR, safePath);

  // If directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // If file doesn't exist, try appending .html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
    filePath = filePath + ".html";
  }

  // Root fallback
  if (pathname === "/" || pathname === "") {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
  } else {
    // 404 handler
    const notFoundPage = path.join(PUBLIC_DIR, "404.html");
    if (fs.existsSync(notFoundPage)) {
      serveFile(res, notFoundPage);
    } else {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 Not Found</h1><p>Resource not found on Sevenseed Platform.</p>");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Sevenseed Node.js Server] Serving golden platform on http://localhost:${PORT}`);
});

