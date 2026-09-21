import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = "C:\\Users\\kunal\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe";
const port = 9335;

// Mobile viewport: 390 x 844 (iPhone 14 / Pixel standard mobile viewport)
const chrome = spawn(chromePath, [
  '--remote-debugging-port=' + port,
  '--headless=new',
  '--window-size=390,844',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--user-data-dir=' + process.env.TEMP + '\\chrome-mobile-test-' + Date.now(),
  'https://sevenseed.onrender.com/'
]);

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const data = await res.json();
      const page = data.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch { await wait(300); }
  }
  throw new Error("Could not connect to Chrome page debugging target");
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === msgId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');
    
    // Set mobile device metrics emulation
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    console.log("Waiting for live page to load on Render...");
    await wait(4500);

    // Evaluate scrollWidth and check for horizontal overflow
    const evalRes = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (function(){
          const pl = document.getElementById('preloader');
          if (pl) pl.remove();
          
          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          const overflowX = scrollWidth - clientWidth;

          // Find any elements exceeding clientWidth
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientWidth + 2) {
              overflowing.push({
                tag: el.tagName,
                cls: el.className,
                id: el.id,
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              });
            }
          });

          return {
            scrollWidth,
            clientWidth,
            bodyScrollWidth,
            overflowX,
            overflowingElementsCount: overflowing.length,
            overflowingSample: overflowing.slice(0, 5)
          };
        })()
      `
    });

    console.log("MOBILE_VIEWPORT_AUDIT_RESULT:", JSON.stringify(evalRes.result.value, null, 2));

    // Capture mobile screenshot
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const artifactPath = 'C:\\Users\\kunal\\.gemini\\antigravity-ide\\brain\\e33d7906-6f35-46b8-b77a-4ed416cd8f38\\live_mobile_verified.png';
    fs.writeFileSync(artifactPath, buffer);
    console.log("SCREENSHOT_SAVED:", artifactPath);

    ws.close();
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    chrome.kill();
  }
}

run();
