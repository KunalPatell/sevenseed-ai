# -*- coding: utf-8 -*-
"""
AVP Emart Portal Generator Module - AI Smart-Shopping & Real-Time Price Radar
"""

def get_emart_data():
    nav_items = [
        ("radar", "Multi-Store Price Radar", "fas fa-radar", "Live"),
        ("deals", "Flash Deal Scraper", "fas fa-tag", "Save 42%"),
        ("delivery", "10-Min Hyperlocal Matrix", "fas fa-bolt-lightning", "10 min"),
        ("splitter", "Smart Basket Splitter", "fas fa-basket-shopping", "AI Cart"),
        ("alerts", "Price Drop Alerter", "fas fa-bell", "Track"),
    ]

    stats_items = [
        ("₹4,820", "Avg Monthly User Savings", "Across 14 Orders", "green"),
        ("5 Platforms", "Live Scraped Vendors", "Amazon, Blinkit, Zepto, Flipkart, Neu", "blue"),
        ("8.4 min", "Hyperlocal Delivery ETA", "Dark Store Sector 62", "purple"),
        ("420+ Deals", "Monitored Flash Sales", "90% Max Discount", "green"),
    ]

    main_content = """
    <!-- TAB 1: MULTI-STORE PRICE RADAR -->
    <div id="tab-radar" class="tab-content active">
      <div class="welcome-box mb-8 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold mb-3">
              <span class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Real-Time E-Commerce Scraping Mesh Active
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">AI Multi-Store Price Comparison Radar</h2>
            <p class="text-sm text-slate-300 mt-2 max-w-[680px] leading-relaxed">
              Scan across Amazon, Flipkart, Blinkit, Zepto, and Tata Neu in sub-second latency. Detect stealth surge pricing, track 90-day price trends, and automatically split your cart for maximum savings.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="switchTab('splitter')" class="run-btn px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <i class="fas fa-wand-magic-sparkles"></i> Split Cart for Lowest Cost
            </button>
            <button onclick="switchTab('deals')" class="px-4 py-3 rounded-xl text-xs font-bold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
              <i class="fas fa-bolt"></i> Flash Deals
            </button>
          </div>
        </div>
      </div>

      <!-- Search Bar & Instant Comparisons -->
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-magnifying-glass text-orange-400"></i> Scan Product Pricing Across All Platforms
            </h3>
            <span class="text-xs text-orange-400 font-mono font-bold">5 Vendor APIs</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Search Product / SKU / Barcode</label>
              <div class="flex gap-2">
                <input type="text" id="radar-search-input" class="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white outline-none focus:border-orange-500" value="Sony WH-1000XM5 Wireless Noise Cancelling Headphones"/>
                <button onclick="scanPrices()" class="run-btn px-5 py-2.5 rounded-xl text-xs font-bold text-white whitespace-nowrap">
                  <i class="fas fa-radar"></i> Scan Now
                </button>
              </div>
            </div>

            <!-- Comparison Table -->
            <div class="space-y-2.5 pt-2">
              <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-lg bg-orange-500 text-slate-950 font-black text-xs grid place-items-center">AMZ</span>
                  <div>
                    <div class="text-xs font-bold text-white flex items-center gap-2">
                      Amazon India
                      <span class="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">LOWEST PRICE</span>
                    </div>
                    <div class="text-[11px] text-slate-300">Prime Delivery: Tomorrow by 11 AM • Free Shipping</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-emerald-400 font-mono">₹26,990</div>
                  <div class="text-[10px] text-slate-400 line-through">MRP: ₹34,990 (23% Off)</div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-lg bg-blue-500 text-white font-black text-xs grid place-items-center">FK</span>
                  <div>
                    <div class="text-xs font-bold text-white">Flipkart</div>
                    <div class="text-[11px] text-slate-400">Plus Delivery: 2 Days • HDFC Card ₹1,500 Off</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-white font-mono">₹28,499</div>
                  <div class="text-[10px] text-slate-400 line-through">MRP: ₹34,990</div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-lg bg-purple-600 text-white font-black text-xs grid place-items-center">NEU</span>
                  <div>
                    <div class="text-xs font-bold text-white">Tata Neu (Croma)</div>
                    <div class="text-[11px] text-slate-400">Store Pickup Available (Koramangala Croma)</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-white font-mono">₹29,990</div>
                  <div class="text-[10px] text-slate-400 line-through">MRP: ₹34,990</div>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="w-9 h-9 rounded-lg bg-yellow-400 text-slate-950 font-black text-xs grid place-items-center">BLN</span>
                  <div>
                    <div class="text-xs font-bold text-white">Blinkit Electronics (Hyperlocal)</div>
                    <div class="text-[11px] text-slate-400">Delivered in 12 Minutes from Dark Store</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-black text-white font-mono">₹29,499</div>
                  <div class="text-[10px] text-slate-400">⚡ Instant 12-min delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 90-Day Price Trend & Verdict -->
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-chart-line text-orange-400"></i> AI Buying Advisory & Verdict
            </h3>
            <span class="text-xs font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">BUY NOW SIGNAL</span>
          </div>

          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <div class="text-xs font-bold text-emerald-300 mb-1">
              <i class="fas fa-check-circle mr-1"></i> Excellent Time to Purchase
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              At ₹26,990, this is within 2% of the all-time lowest price recorded during Diwali Great Indian Festival (₹26,490). Price is expected to revert to ₹29,990 on Monday.
            </p>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-2 border-b border-white/10">
              <span class="text-slate-400">All-Time Lowest:</span>
              <span class="text-emerald-400 font-mono font-bold">₹26,490 (Oct 2025)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/10">
              <span class="text-slate-400">Average 90-Day Price:</span>
              <span class="text-white font-mono font-bold">₹29,150</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/10">
              <span class="text-slate-400">All-Time Highest:</span>
              <span class="text-rose-400 font-mono font-bold">₹34,990 (MRP)</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-400">Best Applied Coupon:</span>
              <span class="text-orange-400 font-mono font-bold">HDFC2000 (Applied)</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-white/10">
            <button onclick="switchTab('alerts')" class="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-bell"></i> Set Price Alert for Below ₹25,000
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: FLASH DEAL SCRAPER -->
    <div id="tab-deals" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-fire text-orange-400"></i> Real-Time Flash Deals & Loot Discounts (>40% Off)
            </h3>
            <p class="text-xs text-slate-400 mt-1">Scraped every 30 seconds across major platforms with verified coupon application</p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Auto-Refreshing</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">54% OFF</span>
                <span class="text-[11px] text-slate-400">Amazon Deals</span>
              </div>
              <div class="text-xs font-bold text-white mb-1">Apple iPad Air M2 (128GB, Wi-Fi, Space Gray)</div>
              <div class="text-sm font-black text-emerald-400 font-mono mt-2">₹44,999 <span class="text-[10px] text-slate-400 line-through">₹59,900</span></div>
            </div>
            <button onclick="alert('Redirecting to Amazon India checkout with coupon auto-applied.')" class="mt-4 w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs">
              Claim Deal <i class="fas fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
            </button>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">62% OFF</span>
                <span class="text-[11px] text-slate-400">Flipkart SuperCoins</span>
              </div>
              <div class="text-xs font-bold text-white mb-1">Dyson V8 Absolute Cordless Vacuum Cleaner</div>
              <div class="text-sm font-black text-emerald-400 font-mono mt-2">₹19,990 <span class="text-[10px] text-slate-400 line-through">₹43,900</span></div>
            </div>
            <button onclick="alert('Redirecting to Flipkart with SuperCoins bonus.')" class="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
              Claim Deal <i class="fas fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
            </button>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">45% OFF</span>
                <span class="text-[11px] text-slate-400">Blinkit Hyperlocal</span>
              </div>
              <div class="text-xs font-bold text-white mb-1">Ferrero Rocher Hazelnut Chocolates (24 Pcs)</div>
              <div class="text-sm font-black text-emerald-400 font-mono mt-2">₹599 <span class="text-[10px] text-slate-400 line-through">₹1,095</span></div>
            </div>
            <button onclick="alert('Added to Blinkit instant 10-minute cart.')" class="mt-4 w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs">
              Claim Deal <i class="fas fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: 10-MIN HYPERLOCAL DELIVERY MATRIX -->
    <div id="tab-delivery" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-stopwatch text-orange-400"></i> Hyperlocal Quick-Commerce Live Radar
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">Dark Stores Active</span>
          </div>

          <div class="space-y-3">
            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 font-black text-sm grid place-items-center">B</div>
                <div>
                  <div class="text-xs font-bold text-white">Blinkit (Zomato)</div>
                  <div class="text-[11px] text-slate-400">Dark Store: 1.2 km away • Delivery Fee: ₹15</div>
                </div>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">8 MIN ETA</span>
                <div class="text-[10px] text-slate-400 mt-1">Normal Surge</div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm grid place-items-center">Z</div>
                <div>
                  <div class="text-xs font-bold text-white">Zepto Quick</div>
                  <div class="text-[11px] text-slate-400">Dark Store: 1.8 km away • Delivery Fee: ₹0 (Pass)</div>
                </div>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">11 MIN ETA</span>
                <div class="text-[10px] text-slate-400 mt-1">Zero Surge</div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-600 text-white font-black text-sm grid place-items-center">I</div>
                <div>
                  <div class="text-xs font-bold text-white">Swiggy Instamart</div>
                  <div class="text-[11px] text-slate-400">Dark Store: 2.1 km away • Delivery Fee: ₹20</div>
                </div>
              </div>
              <div class="text-right">
                <span class="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold">14 MIN ETA</span>
                <div class="text-[10px] text-slate-400 mt-1">Rain Surge ₹10</div>
              </div>
            </div>
          </div>
        </div>

        <div class="workbench-card">
          <h3 class="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-map-pin text-orange-400"></i> Serviceable Dark Store Map
          </h3>
          <div class="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-3 font-mono">
            <div class="text-slate-300">USER LOCATION: Indiranagar 100ft Road, Bengaluru 560038</div>
            <div class="text-emerald-400">✓ Blinkit Hub #BLR-42: Operational (34 Riders Ready)</div>
            <div class="text-emerald-400">✓ Zepto Dark Store #ZP-108: Operational (28 Riders Ready)</div>
            <div class="text-emerald-400">✓ Swiggy Instamart #IM-77: Operational (19 Riders Ready)</div>
            <div class="text-sky-400 pt-2 border-t border-white/10">ALL 3 HUBS WITHIN 2.2 KM RADIUS</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: SMART BASKET SPLITTER -->
    <div id="tab-splitter" class="tab-content">
      <div class="workbench-grid">
        <div class="workbench-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-extrabold text-white flex items-center gap-2">
              <i class="fas fa-cart-arrow-down text-orange-400"></i> AI Smart Cart Optimizer
            </h3>
            <span class="text-xs text-emerald-400 font-mono font-bold">Max Savings Algorithm</span>
          </div>

          <p class="text-xs text-slate-300 mb-4">
            Enter your monthly grocery or tech shopping list. Our combinatorial optimizer splits items across stores to minimize total bill, factoring in delivery charges and coupons.
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-white/70 mb-1.5 uppercase">Shopping List (Items separated by commas)</label>
              <textarea id="cart-items-input" rows="4" class="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 font-mono">Amul Butter 500g, Tata Salt 1kg, Aashirvaad Atta 5kg, Nescafe Classic 100g, Dettol Handwash Refill 750ml, Surf Excel Matic 2kg</textarea>
            </div>

            <button onclick="optimizeCart()" class="run-btn w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
              <i class="fas fa-wand-magic-sparkles"></i> Compute Optimized Cart Split
            </button>
          </div>
        </div>

        <div class="terminal-card">
          <div class="terminal-header">
            <div class="terminal-dots">
              <div class="terminal-dot bg-rose-500"></div>
              <div class="terminal-dot bg-amber-500"></div>
              <div class="terminal-dot bg-emerald-500"></div>
            </div>
            <span class="text-xs font-mono text-slate-400">cart_optimization_result.json</span>
            <button onclick="copyResult('cart-console')" class="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
              <i class="fas fa-copy"></i> Copy
            </button>
          </div>
          <div class="terminal-body" id="cart-console">
[OPTIMIZER READY] Click 'Compute Optimized Cart Split' to analyze item pricing across Blinkit, Zepto, and Amazon Fresh.
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: PRICE DROP ALERTS -->
    <div id="tab-alerts" class="tab-content">
      <div class="workbench-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <i class="fas fa-bell text-orange-400"></i> Active Price Drop Watchers
          </h3>
          <span class="text-xs text-emerald-400 font-mono font-bold">3 Active Monitors</span>
        </div>

        <div class="space-y-3">
          <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">Apple MacBook Air M3 (16GB, 512GB SSD)</div>
              <div class="text-[11px] text-slate-400">Current Price: ₹1,24,900 • Target Alert: ₹1,12,000</div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Active</span>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">Sony PlayStation 5 Slim Disc Edition</div>
              <div class="text-[11px] text-slate-400">Current Price: ₹54,990 • Target Alert: ₹47,990</div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Active</span>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">LG 55-inch 4K OLED Smart TV (C3 Series)</div>
              <div class="text-[11px] text-slate-400">Current Price: ₹1,14,990 • Target Alert: ₹99,990</div>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">Active</span>
          </div>
        </div>
      </div>
    </div>
    """

    script_content = """
    function scanPrices() {
      const q = document.getElementById('radar-search-input').value;
      alert(`Scraping live prices for "${q}" across Amazon, Flipkart, Blinkit, and Tata Neu... Updated in 0.4s!`);
    }

    function optimizeCart() {
      const items = document.getElementById('cart-items-input').value;
      const consoleEl = document.getElementById('cart-console');

      consoleEl.innerHTML = `<span class="text-yellow-400">>> [OPTIMIZING] Running knapsack solver across 6 grocery dark stores...</span>\\n>> Factoring in delivery fees and cart coupon thresholds...`;

      setTimeout(() => {
        consoleEl.innerHTML = `========================================================================
AVP EMART — SMART BASKET SPLIT RESULTS
========================================================================
SINGLE STORE COST (Blinkit): ₹1,640 (Incl. ₹25 fee)
SINGLE STORE COST (Amazon Fresh): ₹1,580 (Delivery Tomorrow)

OPTIMAL 2-STORE SPLIT (Saves ₹340 / 21%):
------------------------------------------------------------------------
[STORE 1]: Blinkit (Hyperlocal Instant - 9 Min ETA)
  • Amul Butter 500g: ₹275 (Lowest)
  • Tata Salt 1kg: ₹28
  • Nescafe Classic 100g: ₹320 (Instant Offer)
  SUBTOTAL: ₹623 | Delivery Fee: ₹0 (Above ₹499 free delivery)

[STORE 2]: Amazon Fresh (Super Saver Bulk - Today 6 PM)
  • Aashirvaad Atta 5kg: ₹245 (₹40 cheaper than Blinkit)
  • Surf Excel Matic 2kg: ₹380 (₹75 cheaper than Blinkit)
  • Dettol Handwash Refill 750ml: ₹152
  SUBTOTAL: ₹777 | Delivery Fee: ₹0 (Prime Free)

TOTAL OPTIMIZED BASKET: ₹1,400 (You saved ₹340 vs ordering all on one app!)
✓ 1-Click Order Link Generated for Both Carts.`;
      }, 700);
    }
    """

    return nav_items, stats_items, main_content, script_content
