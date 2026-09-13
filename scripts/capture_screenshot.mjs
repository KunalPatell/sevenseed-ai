import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = "C:\\Users\\kunal\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe";
const port = 9333;

const chrome = spawn(chromePath, [
  '--remote-debugging-port=' + port,
  '--headless=new',
  '--window-size=1440,900',
  '--enable-webgl',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=d3d11',
  '--user-data-dir=' + process.env.TEMP + '\\chrome-test-profile-' + Date.now(),
  'http://localhost:8088/'
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

    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args?.map(a => a.value));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER ERROR]', msg.params.exceptionDetails);
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await wait(3500);

    await send('Runtime.evaluate', {
      expression: `
        (function(){
          const pl = document.getElementById('preloader');
          if (pl) pl.remove();
          document.querySelectorAll('[data-blur-in]').forEach(el => {
            el.classList.add('bin');
            el.style.opacity = '1';
            el.style.filter = 'none';
            el.style.transform = 'none';
          });
        })()
      `
    });

    await wait(1200);

    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync('C:\\Users\\kunal\\.gemini\\antigravity-ide\\brain\\ad121861-850a-4fbc-b994-2ee5bd71b877\\sevenseed_3d_hero.png', buffer);
    fs.writeFileSync('i:\\Project\\sevenseed-platform\\sevenseed_3d_hero.png', buffer);
    console.log('SUCCESS_SCREENSHOT');
    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
  }
}

run();
