function renderLayout(activePage) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
  
  if (document.getElementById('sidebar-container')) {
    if (currentUser) {
      document.getElementById('sidebar-container').innerHTML = `
        <aside class="sidebar">
          <div class="sidebar-header">StockSim V.1</div>
          <ul class="sidebar-menu">
            <li class="${activePage === 'dashboard' ? 'active' : ''}"><a href="user-dashboard.html">Dashboard</a></li>
            <li class="${activePage === 'market' ? 'active' : ''}"><a href="market.html">Market</a></li>
            <li class="${activePage === 'portfolio' ? 'active' : ''}"><a href="portfolio.html">Portfolio</a></li>
            <li class="${activePage === 'transactions' ? 'active' : ''}"><a href="transactions.html">Transactions</a></li>
            <li class="${activePage === 'profile' ? 'active' : ''}"><a href="profile.html">Profile</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
          </ul>
        </aside>
      `;
    } else if (currentAdmin) {
      document.getElementById('sidebar-container').innerHTML = `
        <aside class="sidebar">
          <div class="sidebar-header">Admin Portal</div>
          <ul class="sidebar-menu">
            <li class="${activePage === 'admin-dashboard' ? 'active' : ''}"><a href="admin-dashboard.html">Dashboard</a></li>
            <li class="${activePage === 'admin-users' ? 'active' : ''}"><a href="admin-users.html">Manage Users</a></li>
            <li class="${activePage === 'admin-stocks' ? 'active' : ''}"><a href="admin-stocks.html">Manage Stocks</a></li>
            <li class="${activePage === 'admin-transactions' ? 'active' : ''}"><a href="admin-transactions.html">Transactions</a></li>
            <li><a href="#" onclick="logout()">Logout</a></li>
          </ul>
        </aside>
      `;
    }
  }

  if (document.getElementById('topbar-container')) {
    const name = currentUser ? currentUser.username : (currentAdmin ? 'Administrator' : 'Guest');
    document.getElementById('topbar-container').innerHTML = `
      <header class="topbar">
        <div style="margin-top: 24px;">Welcome, <strong>${name}</strong></div>
        <div style="margin-top: 24px;">
          ${currentUser ? `Wallet: ₹<span id="topbar-balance">${currentUser.balance.toLocaleString('en-IN', {maximumFractionDigits:2})}</span>` : '<span class="admin-badge">Admin Mode</span>'}
        </div>
      </header>
    `;
  }
}