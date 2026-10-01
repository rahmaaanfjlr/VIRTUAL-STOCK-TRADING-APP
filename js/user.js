function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;

  document.getElementById('profile-username').textContent = user.username;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-created').textContent = new Date(user.createdAt).toLocaleDateString();
  document.getElementById('profile-balance').textContent = '₹' + user.balance.toLocaleString('en-IN', {maximumFractionDigits: 2});
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  if (!user) return;

  let portfolioValue = 0;
  let totalInvestment = 0;
  let holdingsCount = user.portfolio.length;

  user.portfolio.forEach(item => {
    const currentStock = stocks.find(s => s.symbol === item.symbol);
    const currPrice = currentStock ? currentStock.price : item.avgPrice;
    portfolioValue += item.quantity * currPrice;
    totalInvestment += item.quantity * item.avgPrice;
  });

  const profitLoss = portfolioValue - totalInvestment;

  document.getElementById('dash-balance').textContent = '₹' + user.balance.toLocaleString('en-IN', {maximumFractionDigits: 2});
  document.getElementById('dash-portfolio-val').textContent = '₹' + portfolioValue.toLocaleString('en-IN', {maximumFractionDigits: 2});
  document.getElementById('dash-investment').textContent = '₹' + totalInvestment.toLocaleString('en-IN', {maximumFractionDigits: 2});
  
  const plEl = document.getElementById('dash-pl');
  plEl.textContent = '₹' + profitLoss.toLocaleString('en-IN', {maximumFractionDigits: 2});
  plEl.className = 'value ' + (profitLoss >= 0 ? 'text-success' : 'text-danger');

  document.getElementById('dash-holdings').textContent = holdingsCount;

  // Recent Transactions
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const userTx = transactions.filter(t => t.userId === user.id).slice(0, 5);
  const tbody = document.getElementById('recent-transactions-tbody');
  
  if (tbody) {
    tbody.innerHTML = userTx.length ? userTx.map(t => `
      <tr>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td><span style="font-weight:600; color:${t.type==='BUY'?'var(--success)':'var(--danger)'}">${t.type}</span></td>
        <td>${t.symbol}</td>
        <td>${t.quantity}</td>
        <td>₹${t.total.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
      </tr>
    `).join('') : `<tr><td colspan="5" style="text-align:center; color:var(--text-muted)">No recent transactions</td></tr>`;
  }
}