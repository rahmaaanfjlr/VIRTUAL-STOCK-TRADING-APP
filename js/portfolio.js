function renderPortfolioPage() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const stocks = JSON.parse(localStorage.getItem('stocks'));
  const tbody = document.getElementById('portfolio-tbody');
  if (!tbody) return;

  if (!user.portfolio.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-muted)">Your portfolio is empty. Buy stocks from the Market page!</td></tr>`;
    return;
  }

  tbody.innerHTML = user.portfolio.map(item => {
    const currentStock = stocks.find(s => s.symbol === item.symbol);
    const currPrice = currentStock ? currentStock.price : item.avgPrice;
    const invested = item.quantity * item.avgPrice;
    const currentVal = item.quantity * currPrice;
    const pl = currentVal - invested;
    const plPercent = invested > 0 ? (pl / invested) * 100 : 0;

    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.symbol}</td>
        <td>${item.quantity}</td>
        <td>₹${item.avgPrice.toFixed(2)}</td>
        <td>₹${currPrice.toFixed(2)}</td>
        <td>₹${invested.toFixed(2)}</td>
        <td>₹${currentVal.toFixed(2)}</td>
        <td class="${pl >= 0 ? 'text-success' : 'text-danger'}">₹${pl.toFixed(2)}</td>
        <td class="${plPercent >= 0 ? 'text-success' : 'text-danger'}">${plPercent.toFixed(2)}%</td>
        <td>
          <button class="btn btn-success" style="padding:4px 8px; font-size:0.75rem;" onclick="openBuyModal('${item.symbol}')">Buy</button>
          <button class="btn btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="openSellModal('${item.symbol}')">Sell</button>
        </td>
      </tr>
    `;
  }).join('');
}