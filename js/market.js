function simulateMarketPrices() {
  let stocks = JSON.parse(localStorage.getItem('stocks'));
  stocks = stocks.map(stock => {
    const percentChange = (Math.random() * 6 - 3); // -3% to +3%
    const priceChange = Number((stock.price * (percentChange / 100)).toFixed(2));
    const newPrice = Math.max(1, Number((stock.price + priceChange).toFixed(2)));
    return {
      ...stock,
      price: newPrice,
      change: priceChange,
      changePercent: Number(percentChange.toFixed(2))
    };
  });
  localStorage.setItem('stocks', JSON.stringify(stocks));
}

function renderMarketPage() {
  simulateMarketPrices();
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const container = document.getElementById('market-stocks-container');
  if (!container) return;

  container.innerHTML = stocks.map(s => `
    <tr>
      <td><strong>${s.name}</strong><br><small style="color:var(--text-muted)">${s.symbol}</small></td>
      <td>₹${s.price.toFixed(2)}</td>
      <td class="${s.change >= 0 ? 'text-success' : 'text-danger'}">${s.change >= 0 ? '+' : ''}${s.change} (${s.changePercent}%)</td>
      <td>
        <button class="btn btn-success" style="padding:6px 12px; font-size:0.8rem;" onclick="openBuyModal('${s.symbol}')">Buy</button>
        <button class="btn btn-danger" style="padding:6px 12px; font-size:0.8rem;" onclick="openSellModal('${s.symbol}')">Sell</button>
      </td>
    </tr>
  `).join('');
}

let activeSymbol = null;

function openBuyModal(symbol) {
  activeSymbol = symbol;
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const stock = stocks.find(s => s.symbol === symbol);

  document.getElementById('buy-stock-name').textContent = `${stock.name} (${stock.symbol})`;
  document.getElementById('buy-stock-price').textContent = '₹' + stock.price.toFixed(2);
  document.getElementById('buy-wallet-bal').textContent = '₹' + user.balance.toLocaleString('en-IN', {maximumFractionDigits: 2});
  document.getElementById('buy-quantity').value = 1;
  document.getElementById('buy-total-cost').textContent = '₹' + stock.price.toFixed(2);
  
  document.getElementById('buy-modal').style.display = 'flex';
}

function updateBuyTotal() {
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const stock = stocks.find(s => s.symbol === activeSymbol);
  const qty = parseInt(document.getElementById('buy-quantity').value) || 0;
  const total = stock.price * qty;
  document.getElementById('buy-total-cost').textContent = '₹' + total.toLocaleString('en-IN', {maximumFractionDigits: 2});
}

function executeBuy() {
  const qty = parseInt(document.getElementById('buy-quantity').value);
  if (!qty || qty <= 0) {
    showToast('Please enter a valid quantity', 'error');
    return;
  }

  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const stock = stocks.find(s => s.symbol === activeSymbol);
  let users = JSON.parse(localStorage.getItem('users'));
  let user = JSON.parse(localStorage.getItem('currentUser'));

  const totalCost = stock.price * qty;
  if (user.balance < totalCost) {
    showToast('Insufficient virtual balance', 'error');
    return;
  }

  // Update user balance & portfolio
  user.balance -= totalCost;
  const existingHolding = user.portfolio.find(h => h.symbol === activeSymbol);
  if (existingHolding) {
    const totalQty = existingHolding.quantity + qty;
    const totalInvested = (existingHolding.quantity * existingHolding.avgPrice) + totalCost;
    existingHolding.avgPrice = totalInvested / totalQty;
    existingHolding.quantity = totalQty;
  } else {
    user.portfolio.push({
      symbol: activeSymbol,
      name: stock.name,
      quantity: qty,
      avgPrice: stock.price
    });
  }

  // Save users
  users = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));

  // Record transaction
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.unshift({
    id: 'TX_' + Date.now(),
    userId: user.id,
    username: user.username,
    symbol: activeSymbol,
    type: 'BUY',
    quantity: qty,
    price: stock.price,
    total: totalCost,
    date: new Date().toISOString()
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));

  showToast(`Successfully purchased ${qty} shares of ${activeSymbol}`, 'success');
  closeModals();
  renderMarketPage();
  if (typeof loadDashboard === 'function') loadDashboard();
}

function openSellModal(symbol) {
  activeSymbol = symbol;
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const holding = user.portfolio.find(h => h.symbol === symbol);

  if (!holding) {
    showToast('You do not own any shares of this stock', 'error');
    return;
  }

  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const stock = stocks.find(s => s.symbol === symbol);

  document.getElementById('sell-stock-name').textContent = `${stock.name} (${stock.symbol})`;
  document.getElementById('sell-stock-price').textContent = '₹' + stock.price.toFixed(2);
  document.getElementById('sell-owned-qty').textContent = holding.quantity;
  document.getElementById('sell-quantity').value = 1;
  document.getElementById('sell-estimated-proceeds').textContent = '₹' + stock.price.toFixed(2);

  document.getElementById('sell-modal').style.display = 'flex';
}

function updateSellProceeds() {
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const stock = stocks.find(s => s.symbol === activeSymbol);
  const qty = parseInt(document.getElementById('sell-quantity').value) || 0;
  const total = stock.price * qty;
  document.getElementById('sell-estimated-proceeds').textContent = '₹' + total.toLocaleString('en-IN', {maximumFractionDigits: 2});
}

function executeSell() {
  const qty = parseInt(document.getElementById('sell-quantity').value);
  if (!qty || qty <= 0) {
    showToast('Please enter a valid quantity', 'error');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users'));
  let user = JSON.parse(localStorage.getItem('currentUser'));
  const holding = user.portfolio.find(h => h.symbol === activeSymbol);

  if (!holding || holding.quantity < qty) {
    showToast('You do not own enough shares to sell', 'error');
    return;
  }

  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const stock = stocks.find(s => s.symbol === activeSymbol);
  const proceeds = stock.price * qty;

  user.balance += proceeds;
  holding.quantity -= qty;

  if (holding.quantity === 0) {
    user.portfolio = user.portfolio.filter(h => h.symbol !== activeSymbol);
  }

  users = users.map(u => u.id === user.id ? user : u);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));

  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.unshift({
    id: 'TX_' + Date.now(),
    userId: user.id,
    username: user.username,
    symbol: activeSymbol,
    type: 'SELL',
    quantity: qty,
    price: stock.price,
    total: proceeds,
    date: new Date().toISOString()
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));

  showToast(`Successfully sold ${qty} shares of ${activeSymbol}`, 'success');
  closeModals();
  renderMarketPage();
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

function filterMarket() {
  const query = document.getElementById('market-search').value.toLowerCase();
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const filtered = stocks.filter(s => s.name.toLowerCase().includes(query) || s.symbol.toLowerCase().includes(query));
  
  const container = document.getElementById('market-stocks-container');
  if (!container) return;

  container.innerHTML = filtered.map(s => `
    <tr>
      <td><strong>${s.name}</strong><br><small style="color:var(--text-muted)">${s.symbol}</small></td>
      <td>₹${s.price.toFixed(2)}</td>
      <td class="${s.change >= 0 ? 'text-success' : 'text-danger'}">${s.change >= 0 ? '+' : ''}${s.change} (${s.changePercent}%)</td>
      <td>
        <button class="btn btn-success" style="padding:6px 12px; font-size:0.8rem;" onclick="openBuyModal('${s.symbol}')">Buy</button>
        <button class="btn btn-danger" style="padding:6px 12px; font-size:0.8rem;" onclick="openSellModal('${s.symbol}')">Sell</button>
      </td>
    </tr>
  `).join('');
}