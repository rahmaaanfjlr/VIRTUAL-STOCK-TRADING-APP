const DEFAULT_STOCKS = [
  { id: 1, name: "Apple Inc.", symbol: "AAPL", price: 175.50, change: 2.30, changePercent: 1.33 },
  { id: 2, name: "Microsoft Corporation", symbol: "MSFT", price: 415.20, change: -4.10, changePercent: -0.98 },
  { id: 3, name: "Amazon.com Inc.", symbol: "AMZN", price: 178.75, change: 3.45, changePercent: 1.97 },
  { id: 4, name: "Tesla Inc.", symbol: "TSLA", price: 172.80, change: -5.60, changePercent: -3.14 },
  { id: 5, name: "NVIDIA Corporation", symbol: "NVDA", price: 878.35, change: 18.50, changePercent: 2.15 },
  { id: 6, name: "Alphabet Inc.", symbol: "GOOGL", price: 152.40, change: 1.10, changePercent: 0.73 },
  { id: 7, name: "Meta Platforms Inc.", symbol: "META", price: 485.10, change: 7.20, changePercent: 1.51 },
  { id: 8, name: "Netflix Inc.", symbol: "NFLX", price: 612.90, change: -2.30, changePercent: -0.37 },
  { id: 9, name: "Coca-Cola Company", symbol: "KO", price: 60.15, change: 0.25, changePercent: 0.42 },
  { id: 10, name: "JPMorgan Chase & Co.", symbol: "JPM", price: 198.60, change: 1.80, changePercent: 0.91 }
];

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

function initializeStorage() {
  if (!localStorage.getItem('stocks')) {
    localStorage.setItem('stocks', JSON.stringify(DEFAULT_STOCKS));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('transactions')) {
    localStorage.setItem('transactions', JSON.stringify([]));
  }
  if (!localStorage.getItem('adminAccount')) {
    localStorage.setItem('adminAccount', JSON.stringify(ADMIN_CREDENTIALS));
  }
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

initializeStorage();