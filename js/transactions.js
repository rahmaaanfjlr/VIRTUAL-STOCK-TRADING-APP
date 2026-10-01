function renderTransactionsPage(isAdmin = false) {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const tbody = document.getElementById('transactions-tbody');
  if (!tbody) return;

  const filterType = document.getElementById('tx-filter') ? document.getElementById('tx-filter').value : 'ALL';
  
  let list = isAdmin ? transactions : transactions.filter(t => t.userId === currentUser.id);
  if (filterType !== 'ALL') {
    list = list.filter(t => t.type === filterType);
  }

  tbody.innerHTML = list.length ? list.map(t => `
    <tr>
      <td>${new Date(t.date).toLocaleString()}</td>
      ${isAdmin ? `<td>${t.username}</td>` : ''}
      <td>${t.symbol}</td>
      <td><span style="font-weight:600; color:${t.type==='BUY'?'var(--success)':'var(--danger)'}">${t.type}</span></td>
      <td>${t.quantity}</td>
      <td>₹${t.price.toFixed(2)}</td>
      <td>₹${t.total.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
    </tr>
  `).join('') : `<tr><td colspan="${isAdmin ? 7 : 6}" style="text-align:center; color:var(--text-muted)">No transactions found</td></tr>`;
}