# -*- coding: utf-8 -*-
"""
Breakdown Factor — Headless Chrome CDP Meeting Listener Bot.
Connects to a running Chrome instance on port 9222 via Playwright CDP.
"""
import os
import asyncio
import logging
from playwright.async_api import async_playwright

logger = logging.getLogger("breakdown_factor.meeting_listener")

class MeetingListenerBot:
    def __init__(self, platform: str, meeting_url: str, cdp_endpoint: str = "http://127.0.0.1:9222"):
        self.platform = platform
        self.meeting_url = meeting_url
        self.cdp_endpoint = cdp_endpoint
        self._playwright = None
        self._browser = None
        self._context = None
        self._page = None

    async def start(self):
        logger.info("Initializing Playwright CDP link to Chrome on: %s", self.cdp_endpoint)
        self._playwright = await async_playwright().start()
        try:
            self._browser = await self._playwright.chromium.connect_over_cdp(self.cdp_endpoint)
            if self._browser.contexts:
                self._context = self._browser.contexts[0]
            else:
                self._context = await self._browser.new_context()
                
            self._page = self._context.pages[0] if self._context.pages else await self._context.new_page()
            
            logger.info("Browser window linked. Navigating to: %s", self.meeting_url)
            await self._page.goto(self.meeting_url, wait_until="domcontentloaded", timeout=45000)
            await self._page.bring_to_front()
            
            # Simple simulation: let bot wait in meeting and parse chat/audio transcript where possible
            # Google Meet join selectors (mocked from MeetBot adapter)
            join_button_selector = "button:has-text('Join now'), button:has-text('Ask to join')"
            
            # Look for button and click
            for _ in range(5):
                if await self._page.locator(join_button_selector).count() > 0:
                    await self._page.locator(join_button_selector).first.click()
                    logger.info("Clicked join button.")
                    break
                await asyncio.sleep(2)
                
            return {"status": "joined", "url": self.meeting_url}
        except Exception as e:
            logger.error("Failed to connect bot: %s", e)
            return {"status": "failed", "error": str(e)}

    async def stop(self):
        try:
            if self._playwright:
                await self._playwright.stop()
        except Exception as e:
            logger.error("Error stopping worker: %s", e)

def run_background_bot(platform: str, url: str):
    bot = MeetingListenerBot(platform, url)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    res = loop.run_until_complete(bot.start())
    return res
