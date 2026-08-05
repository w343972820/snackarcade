/**
 * Idle Venture — a self-contained static implementation of the idle-clicker
 * mechanics from "0xVenture Capitalist" by bitcraft3r (MIT).
 *
 * The business/manager/upgrade data below is transcribed verbatim from the
 * upstream repo's seed route (app/api/player/business/seed/[id]/route.ts).
 * The game logic and UI in this file are original to this site (MIT) so the
 * game runs fully offline with zero backend, matching the site's self-hosted
 * requirement.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Data — transcribed from the upstream seed route (MIT).
   * ------------------------------------------------------------------ */
  var BUSINESSES = [
    { name: 'Lemonade Stand', icon: '🍋', cost: 3.738, revenue: 1, time: 0.5, multiplier: 1.07, managerName: 'Sam Lemman', managerCost: 1000 },
    { name: 'Mining Rig', icon: '⛏️', cost: 60, revenue: 60, time: 3, multiplier: 1.15, managerName: 'Wuhan Ji', managerCost: 15000 },
    { name: 'Tuxedo Tailor', icon: '🤵', cost: 720, revenue: 540, time: 6, multiplier: 1.14, managerName: 'Cuck Marbeles', managerCost: 100000 },
    { name: 'Vegetable Farm', icon: '🥕', cost: 8640, revenue: 4320, time: 12, multiplier: 1.13, managerName: 'Arthur Hays', managerCost: 500000 },
    { name: 'Ramen Store', icon: '🍜', cost: 103680, revenue: 51840, time: 24, multiplier: 1.12, managerName: 'Ko Dwon', managerCost: 1200000 },
    { name: 'Shrimp Boat', icon: '🦐', cost: 1244160, revenue: 622080, time: 96, multiplier: 1.11, managerName: 'Suzie Krylebaby', managerCost: 10000000 },
    { name: 'eSports Team', icon: '🎮', cost: 14929920, revenue: 7464960, time: 384, multiplier: 1.1, managerName: 'Justina San', managerCost: 111111111 },
    { name: 'Cryptocurrency Exchange', icon: '🪙', cost: 179159040, revenue: 89579520, time: 1536, multiplier: 1.09, managerName: 'Chao Zi Pang', managerCost: 555555555 },
    { name: 'Metaverse Company', icon: '🌐', cost: 2149908480, revenue: 1074954240, time: 6144, multiplier: 1.08, managerName: 'Bear Shillbert', managerCost: 10000000000 },
    { name: 'Blockchain Currency', icon: '⛓️', cost: 25798901760, revenue: 29668737024, time: 36864, multiplier: 1.07, managerName: 'Carlos Matos', managerCost: 100000000000 },
  ];

  // Upgrades: each is either for one business (by name) or for ALL businesses.
  var UPGRADES = [
    { name: 'Little Umbrellas', business: 'Lemonade Stand', price: 250000, description: 'Lemonade Stand Profits x3' },
    { name: 'Overclocked CPU', business: 'Mining Rig', price: 500000, description: 'Mining Rig Profits x3' },
    { name: 'Sewing Machine', business: 'Tuxedo Tailor', price: 1000000, description: 'Tuxedo Tailor Profits x3' },
    { name: 'Auto Sprinklers', business: 'Vegetable Farm', price: 5000000, description: 'Vegetable Farm Profits x3' },
    { name: 'Pre-packaged Ramen', business: 'Ramen Store', price: 10000000, description: 'Ramen Store Profits x3' },
    { name: 'Shrimp Satellite', business: 'Shrimp Boat', price: 25000000, description: 'Shrimp Boat Profits x3' },
    { name: 'Gaming Equipment', business: 'eSports Team', price: 500000000, description: 'eSports Team Profits x3' },
    { name: 'Market Making Team', business: 'Cryptocurrency Exchange', price: 10000000000, description: 'Cryptocurrency Exchange Profits x3' },
    { name: 'Land Sale', business: 'Metaverse Company', price: 50000000000, description: 'Metaverse Company Profits x3' },
    { name: 'Proof of Stake', business: 'Blockchain Currency', price: 250000000000, description: 'Blockchain Currency Profits x3' },
    { name: 'Monopoly', business: 'All Businesses', price: 1000000000000, description: 'All Profits x3' },
    { name: 'Novelty Straws', business: 'Lemonade Stand', price: 20000000000000, description: 'Lemonade Stand Profits x3' },
    { name: 'ASIC Upgrade', business: 'Mining Rig', price: 50000000000000, description: 'Mining Rig Profits x3' },
    { name: 'Robot Tailors', business: 'Tuxedo Tailor', price: 100000000000000, description: 'Tuxedo Tailor Profits x3' },
    { name: 'Automatic Weeders', business: 'Vegetable Farm', price: 500000000000000, description: 'Vegetable Farm Profits x3' },
    { name: 'Truffle & Caviar', business: 'Ramen Store', price: 1000000000000000, description: 'Ramen Store Profits x3' },
    { name: 'Shrimp Magnets', business: 'Shrimp Boat', price: 2000000000000000, description: 'Shrimp Boat Profits x3' },
    { name: 'Energy Drink Sponsors', business: 'eSports Team', price: 5000000000000000, description: 'eSports Team Profits x3' },
    { name: 'Launch Blockchain', business: 'Cryptocurrency Exchange', price: 10000000000000000, description: 'Cryptocurrency Exchange Profits x3' },
    { name: 'VR Integration', business: 'Metaverse Company', price: 20000000000000000, description: 'Metaverse Company Profits x3' },
    { name: 'Deflationary Tokenomics', business: 'Blockchain Currency', price: 50000000000000000, description: 'Blockchain Currency Profits x3' },
    { name: 'Monopsony', business: 'All Businesses', price: 100000000000000000, description: 'All Profits x3' },
  ];

  /* ------------------------------------------------------------------ *
   *  State
   * ------------------------------------------------------------------ */
  var state = {
    coins: 0,
    buyQty: 1,
    businesses: BUSINESSES.map(function (b) {
      return {
        name: b.name,
        quantity: b.name === 'Lemonade Stand' ? 1 : 0,
        managerOwned: false,
        timeMultiplier: 1,   // speed boosts divide effective time
        revenueMultiplier: 1, // x3/x4/x5 revenue boosts
        progress: 0,
      };
    }),
    upgradesOwned: {},
  };

  var SAVE_KEY = 'snackarcade-idle-venture-v1';

  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      state.coins = saved.coins ?? 0;
      state.buyQty = saved.buyQty ?? 1;
      state.upgradesOwned = saved.upgradesOwned ?? {};
      if (Array.isArray(saved.businesses) && saved.businesses.length === BUSINESSES.length) {
        state.businesses = saved.businesses;
      }
    } catch (e) { /* ignore corrupt saves */ }
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* storage may be unavailable; ignore */ }
  }

  /* ------------------------------------------------------------------ *
   *  Helpers
   * ------------------------------------------------------------------ */
  function fmt(n) {
    if (n >= 1e15) return '$' + (n / 1e15).toFixed(2) + 'Q';
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: n < 10 ? 2 : 0 });
  }

  /** Total multiplier applied to one business's revenue. */
  function bizMultiplier(index) {
    var name = BUSINESSES[index].name;
    var mult = state.businesses[index].revenueMultiplier;
    for (var key in state.upgradesOwned) {
      if (!state.upgradesOwned[key]) continue;
      var up = UPGRADES[key];
      if (up.business === name || up.business === 'All Businesses') mult *= 3;
    }
    return mult;
  }

  /** Cost to buy `qty` more of business `index`. */
  function costFor(index, qty) {
    var b = BUSINESSES[index];
    var q = state.businesses[index].quantity;
    // Sum of geometric series: cost * multiplier^q * (multiplier^qty - 1) / (multiplier - 1)
    return b.cost * ((Math.pow(b.multiplier, q) * (Math.pow(b.multiplier, qty) - 1)) / (b.multiplier - 1));
  }

  /** Effective seconds per revenue cycle (speed boosts halve it). */
  function effectiveTime(index) {
    return BUSINESSES[index].time / state.businesses[index].timeMultiplier;
  }

  /** Revenue per cycle for one business with its current quantity. */
  function cycleRevenue(index) {
    var b = BUSINESSES[index];
    var q = state.businesses[index].quantity;
    return b.revenue * q * bizMultiplier(index);
  }

  /** Coins per second produced by managed businesses. */
  function coinsPerSecond() {
    var total = 0;
    for (var i = 0; i < state.businesses.length; i += 1) {
      var biz = state.businesses[i];
      if (biz.quantity > 0 && biz.managerOwned) {
        total += cycleRevenue(i) / effectiveTime(i);
      }
    }
    return total;
  }

  /* ------------------------------------------------------------------ *
   *  DOM
   * ------------------------------------------------------------------ */
  var coinsEl = document.getElementById('coins');
  var perSecEl = document.getElementById('per-sec');
  var businessesEl = document.getElementById('businesses');
  var upgradesEl = document.getElementById('upgrades');
  var buyQtyEl = document.getElementById('buy-qty');
  var resetBtn = document.getElementById('reset');
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function renderCoins() {
    coinsEl.textContent = fmt(state.coins);
    var cps = coinsPerSecond();
    perSecEl.textContent = cps > 0 ? fmt(cps) + '/s' : '';
  }

  function renderBusinesses() {
    businessesEl.innerHTML = '';
    var qty = state.buyQty;
    for (var i = 0; i < BUSINESSES.length; i += 1) {
      var b = BUSINESSES[i];
      var biz = state.businesses[i];
      var cost = costFor(i, qty);
      var affordable = state.coins >= cost;

      var row = document.createElement('div');
      row.className = 'biz';

      var icon = document.createElement('div');
      icon.className = 'icon' + (biz.quantity === 0 ? ' disabled' : '') + (biz.managerOwned ? ' managed' : '');
      icon.textContent = b.icon;
      icon.title = biz.managerOwned
        ? b.managerName + ' runs this business'
        : (biz.quantity > 0 ? 'Collect ' + fmt(cycleRevenue(i)) : 'Buy your first ' + b.name);
      icon.addEventListener('click', function (idx) {
        return function () { collect(idx); };
      }(i));

      var info = document.createElement('div');
      info.className = 'info';
      var name = document.createElement('div');
      name.className = 'name';
      name.textContent = b.name;
      var qtyEl = document.createElement('div');
      qtyEl.className = 'qty';
      qtyEl.textContent = 'Owned: ' + biz.quantity +
        (biz.managerOwned ? ' · Manager: ' + b.managerName : '') +
        ' · Earns ' + fmt(cycleRevenue(i)) + ' per ' + effectiveTime(i).toFixed(1) + 's';
      var progress = document.createElement('div');
      progress.className = 'progress';
      var bar = document.createElement('div');
      bar.className = 'bar';
      if (biz.managerOwned) {
        bar.style.width = Math.min(100, biz.progress * 100) + '%';
      }
      progress.appendChild(bar);
      info.appendChild(name);
      info.appendChild(qtyEl);
      info.appendChild(progress);

      var actions = document.createElement('div');
      actions.className = 'actions';
      var revenue = document.createElement('div');
      revenue.className = 'revenue';
      revenue.textContent = fmt(cost);
      var buy = document.createElement('button');
      buy.className = 'buy' + (affordable ? '' : ' disabled');
      buy.textContent = 'Buy ×' + qty;
      buy.disabled = !affordable;
      buy.addEventListener('click', function (idx) {
        return function () { buyBiz(idx); };
      }(i));
      actions.appendChild(revenue);
      actions.appendChild(buy);

      var manager = document.createElement('button');
      manager.className = 'manager' + (biz.managerOwned ? ' owned' : '');
      manager.textContent = biz.managerOwned
        ? b.managerName
        : 'Hire ' + b.managerName + ' · ' + fmt(b.managerCost);
      manager.disabled = biz.managerOwned || state.coins < b.managerCost || biz.quantity === 0;
      manager.addEventListener('click', function (idx) {
        return function () { hireManager(idx); };
      }(i));
      actions.appendChild(manager);

      row.appendChild(icon);
      row.appendChild(info);
      row.appendChild(actions);
      businessesEl.appendChild(row);

      // Store a reference for the progress animation loop.
      biz._bar = bar;
    }
  }

  function renderUpgrades() {
    upgradesEl.innerHTML = '';
    var header = document.createElement('h2');
    header.textContent = 'Upgrades';
    upgradesEl.appendChild(header);

    var shown = 0;
    for (var i = 0; i < UPGRADES.length; i += 1) {
      var up = UPGRADES[i];
      var owned = !!state.upgradesOwned[i];
      var affordable = state.coins >= up.price;

      var row = document.createElement('div');
      row.className = 'upgrade' + (owned ? ' owned' : '');
      var desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = up.name + ' — ' + up.description;
      var price = document.createElement('div');
      price.className = 'price';
      price.textContent = fmt(up.price);
      var btn = document.createElement('button');
      btn.textContent = 'Buy';
      btn.disabled = owned || !affordable;
      if (owned || !affordable) btn.classList.add('disabled');
      btn.addEventListener('click', function (idx) {
        return function () { buyUpgrade(idx); };
      }(i));

      row.appendChild(desc);
      row.appendChild(price);
      row.appendChild(btn);
      upgradesEl.appendChild(row);
      shown += 1;
      if (shown >= 12) break; // keep the list manageable
    }
  }

  /* ------------------------------------------------------------------ *
   *  Actions
   * ------------------------------------------------------------------ */
  function collect(index) {
    var biz = state.businesses[index];
    if (biz.quantity < 1) {
      showToast('You must own at least one ' + BUSINESSES[index].name + ' first!');
      return;
    }
    if (biz.managerOwned) {
      showToast(BUSINESSES[index].managerName + ' already runs this business!');
      return;
    }
    var amount = cycleRevenue(index);
    state.coins += amount;
    biz.progress = 0;
    showToast('Collected ' + fmt(amount) + ' from ' + BUSINESSES[index].name + '!');
    renderAll();
  }

  function buyBiz(index) {
    var qty = state.buyQty;
    var cost = costFor(index, qty);
    if (state.coins < cost) {
      showToast('Not enough coins!');
      return;
    }
    var biz = state.businesses[index];
    var before = biz.quantity;
    state.coins -= cost;
    biz.quantity += qty;

    // Milestone boosts (mirrors the upstream buy route).
    applyMilestones(index, before, biz.quantity);

    showToast('Purchased ' + qty + ' ' + BUSINESSES[index].name + '!');
    renderAll();
  }

  /** Apply the quantity-milestone speed/revenue boosts from the upstream game. */
  function applyMilestones(index, before, after) {
    var biz = state.businesses[index];
    // Speed: /2 at 25, 50, 100, 200, 300, 400.
    [25, 50, 100, 200, 300, 400].forEach(function (m) {
      if (before < m && after >= m) {
        biz.timeMultiplier *= 2;
        showToast('2x speed on your ' + BUSINESSES[index].name + '!');
      }
    });
    // Revenue: x4 between 500..1900.
    if (before < 500 && after >= 500) { biz.revenueMultiplier *= 4; showToast('4x revenue on your ' + BUSINESSES[index].name + '!'); }
    if (before < 1000 && after >= 1000) { biz.revenueMultiplier *= 5; showToast('5x revenue on your ' + BUSINESSES[index].name + '!'); }
    if (before < 2000 && after >= 2000) { biz.revenueMultiplier *= 5; showToast('5x revenue on your ' + BUSINESSES[index].name + '!'); }
  }

  function hireManager(index) {
    var b = BUSINESSES[index];
    var biz = state.businesses[index];
    if (biz.managerOwned || biz.quantity < 1) return;
    if (state.coins < b.managerCost) {
      showToast('Not enough coins to hire ' + b.managerName + '!');
      return;
    }
    state.coins -= b.managerCost;
    biz.managerOwned = true;
    biz.progress = 0;
    showToast(b.managerName + ' now runs your ' + b.name + '!');
    renderAll();
  }

  function buyUpgrade(index) {
    var up = UPGRADES[index];
    if (state.upgradesOwned[index] || state.coins < up.price) {
      showToast('Not enough coins!');
      return;
    }
    state.coins -= up.price;
    state.upgradesOwned[index] = true;
    showToast('Purchased ' + up.name + '!');
    renderAll();
  }

  function reset() {
    if (!window.confirm('Reset all progress?')) return;
    state.coins = 0;
    state.buyQty = 1;
    state.businesses = BUSINESSES.map(function (b) {
      return {
        name: b.name,
        quantity: b.name === 'Lemonade Stand' ? 1 : 0,
        managerOwned: false,
        timeMultiplier: 1,
        revenueMultiplier: 1,
        progress: 0,
      };
    });
    state.upgradesOwned = {};
    save();
    renderAll();
  }

  function renderAll() {
    renderCoins();
    renderBusinesses();
    renderUpgrades();
  }

  /* ------------------------------------------------------------------ *
   *  Game loop — managers auto-collect on their own cycle.
   * ------------------------------------------------------------------ */
  var lastTick = Date.now();
  setInterval(function () {
    var now = Date.now();
    var dt = (now - lastTick) / 1000;
    lastTick = now;
    var changed = false;

    for (var i = 0; i < state.businesses.length; i += 1) {
      var biz = state.businesses[i];
      if (!biz.managerOwned || biz.quantity < 1) continue;
      biz.progress += dt / effectiveTime(i);
      if (biz.progress >= 1) {
        biz.progress = 0;
        state.coins += cycleRevenue(i);
        changed = true;
      }
      if (biz._bar) biz._bar.style.width = Math.min(100, biz.progress * 100) + '%';
    }

    if (changed) {
      renderCoins();
      renderBusinesses();
    }
  }, 250);

  /* ------------------------------------------------------------------ *
   *  Init
   * ------------------------------------------------------------------ */
  load();
  buyQtyEl.addEventListener('change', function () {
    state.buyQty = Number(buyQtyEl.value) || 1;
    save();
    renderBusinesses();
  });
  resetBtn.addEventListener('click', reset);
  setInterval(save, 5000);
  renderAll();
})();
