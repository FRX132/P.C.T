// ───────────────────── Forex.com Connection Setup
let forexEnabled = false;
let forexClient = null;
let forexSubscription = null;
let forexSessionToken = null;

// ───────────────────── MetaTrader 5 (MetaApi) Connection Setup
let mt5Enabled = false;
let mt5Token = null;
let mt5AccountId = null;
let mt5Region = "new-york";

// ───────────────────── Massive.com Connection Setup
let massiveEnabled = false;
let massiveApiKey = null;

const FINANZEN_NET_URLS = {
    EURUSD: "https://www.finanzen.net/devisen/dollarkurs",
    GBPUSD: "https://www.finanzen.net/devisen/pfund-dollar-kurs",
    USDJPY: "https://www.finanzen.net/devisen/dollar-yen-kurs",
    USDCHF: "https://www.finanzen.net/devisen/dollar-franken-kurs",
    USDCAD: "https://www.finanzen.net/devisen/dollar-kanadischer_dollar-kurs",
    AUDUSD: "https://www.finanzen.net/devisen/australischer_dollar-us_dollar-kurs",
    NZDUSD: "https://www.finanzen.net/devisen/neuseeland_dollar-us_dollar-kurs",
    EURGBP: "https://www.finanzen.net/devisen/euro-pfund-kurs",
    EURJPY: "https://www.finanzen.net/devisen/euro-yen-kurs",
    EURCHF: "https://www.finanzen.net/devisen/euro-franken-kurs",
    EURAUD: "https://www.finanzen.net/devisen/euro-australischer_dollar-kurs",
    EURCAD: "https://www.finanzen.net/devisen/euro-kanadischer_dollar-kurs",
    EURNZD: "https://www.finanzen.net/devisen/euro-neuseeland_dollar-kurs",
    GBPJPY: "https://www.finanzen.net/devisen/pfund-yen-kurs",
    GBPCHF: "https://www.finanzen.net/devisen/pfund-franken-kurs",
    GBPAUD: "https://www.finanzen.net/devisen/pfund-australischer_dollar-kurs",
    GBPCAD: "https://www.finanzen.net/devisen/pfund-kanadischer_dollar-kurs",
    GBPNZD: "https://www.finanzen.net/devisen/pfund-neuseeland_dollar-kurs",
    AUDJPY: "https://www.finanzen.net/devisen/australischer_dollar-yen-kurs",
    AUDCHF: "https://www.finanzen.net/devisen/australischer_dollar-franken-kurs",
    AUDCAD: "https://www.finanzen.net/devisen/australischer_dollar-kanadischer_dollar-kurs",
    AUDNZD: "https://www.finanzen.net/devisen/australischer_dollar-neuseeland_dollar-kurs",
    CADJPY: "https://www.finanzen.net/devisen/kanadischer_dollar-yen-kurs",
    CADCHF: "https://www.finanzen.net/devisen/kanadischer_dollar-franken-kurs",
    CHFJPY: "https://www.finanzen.net/devisen/franken-yen-kurs",
    NZDJPY: "https://www.finanzen.net/devisen/neuseeland_dollar-yen-kurs",
    NZDCHF: "https://www.finanzen.net/devisen/neuseeland_dollar-franken-kurs",
    NZDCAD: "https://www.finanzen.net/devisen/neuseeland_dollar-kanadischer_dollar-kurs",
    USDTRY: "https://www.finanzen.net/devisen/dollar-tuerkische_lira-kurs",
    EURTRY: "https://www.finanzen.net/devisen/euro-tuerkische_lira-kurs",
    USDZAR: "https://www.finanzen.net/devisen/dollar-rand-kurs",
    USDMXN: "https://www.finanzen.net/devisen/dollar-mexikanischer_peso-kurs",
    USDSGD: "https://www.finanzen.net/devisen/dollar-singapur_dollar-kurs",
    USDHKD: "https://www.finanzen.net/devisen/dollar-hongkong_dollar-kurs",
    USDCNH: "https://www.finanzen.net/devisen/dollar-yuan_renminbi-kurs",
    USDSEK: "https://www.finanzen.net/devisen/dollar-schwedische_krone-kurs",
    USDNOK: "https://www.finanzen.net/devisen/dollar-norwegische_krone-kurs",
    USDDKK: "https://www.finanzen.net/devisen/dollar-daenische_krone-kurs",
    USDPLN: "https://www.finanzen.net/devisen/dollar-polnischer_zloty-kurs",
    XAUUSD: "https://www.finanzen.net/rohstoffe/goldpreis",
    XAGUSD: "https://www.finanzen.net/rohstoffe/silberpreis"
};

const FOREX_MARKET_IDS = {
    EURUSD: 400481117,
    GBPUSD: 400481118,
    USDJPY: 400481119,
    XAUUSD: 400481134,
    XAGUSD: 400481135,
    USDCHF: 400481120,
    USDCAD: 400481121,
    AUDUSD: 400481122,
    NZDUSD: 400481123,
    EURGBP: 400481124,
    EURJPY: 400481125,
    GBPJPY: 400481126,
    GBPCHF: 400481127
};

// ───────────────────── Asset Configurations & Prices
const ASSETS = {
    // Majors
    EURUSD: { name: "EUR/USD", precision: 5, basePrice: 1.0850, step: 0.00008, atr: 0.00075, cat: "Majors" },
    GBPUSD: { name: "GBP/USD", precision: 5, basePrice: 1.2720, step: 0.00009, atr: 0.00085, cat: "Majors" },
    USDJPY: { name: "USD/JPY", precision: 3, basePrice: 156.40, step: 0.02, atr: 0.150, cat: "Majors" },
    USDCHF: { name: "USD/CHF", precision: 5, basePrice: 0.8950, step: 0.00007, atr: 0.00065, cat: "Majors" },
    USDCAD: { name: "USD/CAD", precision: 5, basePrice: 1.3680, step: 0.00008, atr: 0.00070, cat: "Majors" },
    AUDUSD: { name: "AUD/USD", precision: 5, basePrice: 0.6650, step: 0.00006, atr: 0.00060, cat: "Majors" },
    NZDUSD: { name: "NZD/USD", precision: 5, basePrice: 0.6120, step: 0.00006, atr: 0.00060, cat: "Majors" },

    // Minors & Crosses
    EURGBP: { name: "EUR/GBP", precision: 5, basePrice: 0.8520, step: 0.00005, atr: 0.00045, cat: "Minors" },
    EURJPY: { name: "EUR/JPY", precision: 3, basePrice: 169.70, step: 0.022, atr: 0.160, cat: "Minors" },
    EURCHF: { name: "EUR/CHF", precision: 5, basePrice: 0.9710, step: 0.00006, atr: 0.00055, cat: "Minors" },
    EURAUD: { name: "EUR/AUD", precision: 5, basePrice: 1.6320, step: 0.00010, atr: 0.00090, cat: "Minors" },
    EURCAD: { name: "EUR/CAD", precision: 5, basePrice: 1.4840, step: 0.00009, atr: 0.00080, cat: "Minors" },
    EURNZD: { name: "EUR/NZD", precision: 5, basePrice: 1.7720, step: 0.00012, atr: 0.00110, cat: "Minors" },
    GBPJPY: { name: "GBPJPY", precision: 3, basePrice: 198.20, step: 0.025, atr: 0.180, cat: "Minors" },
    GBPCHF: { name: "GBP/CHF", precision: 5, basePrice: 1.1390, step: 0.00008, atr: 0.00075, cat: "Minors" },
    GBPAUD: { name: "GBP/AUD", precision: 5, basePrice: 1.9120, step: 0.00012, atr: 0.00110, cat: "Minors" },
    GBPCAD: { name: "GBP/CAD", precision: 5, basePrice: 1.7390, step: 0.00011, atr: 0.00100, cat: "Minors" },
    GBPNZD: { name: "GBP/NZD", precision: 5, basePrice: 2.0780, step: 0.00014, atr: 0.00130, cat: "Minors" },
    AUDJPY: { name: "AUD/JPY", precision: 3, basePrice: 104.10, step: 0.015, atr: 0.110, cat: "Minors" },
    AUDCHF: { name: "AUD/CHF", precision: 5, basePrice: 0.5950, step: 0.00005, atr: 0.00050, cat: "Minors" },
    AUDCAD: { name: "AUD/CAD", precision: 5, basePrice: 0.9100, step: 0.00007, atr: 0.00065, cat: "Minors" },
    AUDNZD: { name: "AUD/NZD", precision: 5, basePrice: 1.0850, step: 0.00006, atr: 0.00060, cat: "Minors" },
    CADJPY: { name: "CAD/JPY", precision: 3, basePrice: 114.30, step: 0.016, atr: 0.120, cat: "Minors" },
    CADCHF: { name: "CAD/CHF", precision: 5, basePrice: 0.6540, step: 0.00006, atr: 0.00055, cat: "Minors" },
    CHFJPY: { name: "CHF/JPY", precision: 3, basePrice: 174.60, step: 0.024, atr: 0.170, cat: "Minors" },
    NZDJPY: { name: "NZD/JPY", precision: 3, basePrice: 95.80, step: 0.014, atr: 0.100, cat: "Minors" },
    NZDCHF: { name: "NZD/CHF", precision: 5, basePrice: 0.5480, step: 0.00005, atr: 0.00050, cat: "Minors" },
    NZDCAD: { name: "NZD/CAD", precision: 5, basePrice: 0.8380, step: 0.00007, atr: 0.00065, cat: "Minors" },

    // Exotics
    USDTRY: { name: "USD/TRY", precision: 4, basePrice: 32.80, step: 0.015, atr: 0.120, cat: "Exotics" },
    EURTRY: { name: "EUR/TRY", precision: 4, basePrice: 35.60, step: 0.018, atr: 0.140, cat: "Exotics" },
    USDZAR: { name: "USD/ZAR", precision: 4, basePrice: 18.20, step: 0.005, atr: 0.050, cat: "Exotics" },
    USDMXN: { name: "USD/MXN", precision: 4, basePrice: 18.50, step: 0.006, atr: 0.060, cat: "Exotics" },
    USDSGD: { name: "USD/SGD", precision: 4, basePrice: 1.3520, step: 0.0002, atr: 0.0020, cat: "Exotics" },
    USDHKD: { name: "USD/HKD", precision: 4, basePrice: 7.8100, step: 0.0005, atr: 0.0030, cat: "Exotics" },
    USDCNH: { name: "USD/CNH", precision: 4, basePrice: 7.2800, step: 0.001, atr: 0.0080, cat: "Exotics" },
    USDSEK: { name: "USD/SEK", precision: 4, basePrice: 10.45, step: 0.004, atr: 0.035, cat: "Exotics" },
    USDNOK: { name: "USD/NOK", precision: 4, basePrice: 10.55, step: 0.004, atr: 0.038, cat: "Exotics" },
    USDDKK: { name: "USD/DKK", precision: 4, basePrice: 6.9500, step: 0.0005, atr: 0.0050, cat: "Exotics" },
    USDPLN: { name: "USD/PLN", precision: 4, basePrice: 4.0200, step: 0.0015, atr: 0.0120, cat: "Exotics" },

    // Metals
    XAUUSD: { name: "GOLD (XAU/USD)", precision: 2, basePrice: 2330.00, step: 0.35, atr: 3.50, cat: "Metals" },
    XAGUSD: { name: "SILVER (XAG/USD)", precision: 3, basePrice: 29.50, step: 0.008, atr: 0.085, cat: "Metals" }
};

let currentSymbol = "EURUSD";
let livePrice = ASSETS[currentSymbol].basePrice;
let lastUpdateTime = Math.floor(Date.now() / 1000);
let chartData = [];
let activeTrade = null;
let tradesList = [];
let realtimeDataEnabled = true;
let tickCounter = 0;

// ───────────────────── Dropdown Search Selector Functions
function populateSymbolDropdown() {
    const resultsDiv = document.getElementById('symbol-results');
    resultsDiv.innerHTML = '';
    
    Object.keys(ASSETS).forEach(sym => {
        const opt = document.createElement('div');
        opt.className = 'sym-option';
        opt.setAttribute('data-symbol', sym);
        opt.innerHTML = `
            <span class="sym-option-name">${sym}</span>
            <span class="sym-option-cat">${ASSETS[sym].cat || 'Forex'}</span>
        `;
        opt.addEventListener('click', () => {
            selectSymbol(sym);
        });
        resultsDiv.appendChild(opt);
    });
}

function showSymbolList() {
    const resultsDiv = document.getElementById('symbol-results');
    resultsDiv.style.display = 'block';
    filterSymbols(); 
}

function filterSymbols() {
    const query = document.getElementById('symbol-search').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const resultsDiv = document.getElementById('symbol-results');
    const options = resultsDiv.getElementsByClassName('sym-option');
    let matchCount = 0;
    
    const existingAdder = document.getElementById('custom-sym-adder');
    if (existingAdder) existingAdder.remove();

    for (let opt of options) {
        const sym = opt.getAttribute('data-symbol');
        if (sym.includes(query)) {
            opt.style.display = 'flex';
            matchCount++;
        } else {
            opt.style.display = 'none';
        }
    }
    
    if (matchCount === 0 && query.length >= 4) {
        const adder = document.createElement('div');
        adder.id = 'custom-sym-adder';
        adder.className = 'sym-option';
        adder.innerHTML = `
            <span class="custom-sym-text">Hinzufügen: "${query}"</span>
            <span class="sym-option-cat custom-sym-badge">CUSTOM</span>
        `;
        adder.addEventListener('click', () => {
            addCustomSymbol(query);
        });
        resultsDiv.appendChild(adder);
    }
}

function selectSymbol(sym) {
    document.getElementById('symbol-search').value = sym;
    document.getElementById('symbol-results').style.display = 'none';
    
    // Update Watchlist Active State in Sidebar Watchlist
    const items = document.querySelectorAll('.watchlist-item');
    items.forEach(item => {
        if (item.getAttribute('data-sym') === sym) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    changeAsset(sym);
}

function addCustomSymbol(sym) {
    if (ASSETS[sym]) return; 
    
    let precision = 5;
    let step = 0.00008;
    let atr = 0.00075;
    
    if (sym.includes('JPY')) {
        precision = 3;
        step = 0.02;
        atr = 0.150;
    } else if (sym.includes('TRY') || sym.includes('MXN') || sym.includes('ZAR') || sym.includes('RUB')) {
        precision = 4;
        step = 0.008;
        atr = 0.065;
    } else if (sym.startsWith('XAU')) {
        precision = 2;
        step = 0.35;
        atr = 3.50;
    } else if (sym.startsWith('XAG')) {
        precision = 3;
        step = 0.008;
        atr = 0.085;
    }
    
    ASSETS[sym] = {
        name: `${sym.substring(0, 3)}/${sym.substring(3)}`,
        precision: precision,
        basePrice: 1.00, 
        step: step,
        atr: atr,
        cat: "Custom"
    };

    const resultsDiv = document.getElementById('symbol-results');
    const opt = document.createElement('div');
    opt.className = 'sym-option';
    opt.setAttribute('data-symbol', sym);
    opt.innerHTML = `
        <span class="sym-option-name">${sym}</span>
        <span class="sym-option-cat">Custom</span>
    `;
    opt.addEventListener('click', () => {
        selectSymbol(sym);
    });
    resultsDiv.appendChild(opt);
    
    selectSymbol(sym);
}

function handleSearchKey(e) {
    if (e.key === 'Enter') {
        const query = document.getElementById('symbol-search').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (query.length >= 4) {
            if (ASSETS[query]) {
                selectSymbol(query);
            } else {
                addCustomSymbol(query);
            }
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const searchInput = document.getElementById('symbol-search');
    if (searchInput && !searchInput.parentElement.contains(e.target)) {
        document.getElementById('symbol-results').style.display = 'none';
    }
});

// ───────────────────── Timeframe Configuration & State
let currentTimeframe = '15m';
const TIMEFRAMES = {
    "1m":  { interval: "1m",  range: "1d" },
    "5m":  { interval: "5m",  range: "5d" },
    "15m": { interval: "15m", range: "5d" },
    "1h":  { interval: "1h",  range: "14d" },
    "4h":  { interval: "60m", range: "30d" },
    "1D":  { interval: "1d",  range: "60d" }
};

function calculateEMA(data, period = 50) {
    if (data.length < period) return [];
    const k = 2 / (period + 1);
    let emaArray = [];
    
    // Calculate initial SMA
    let sma = 0;
    for (let i = 0; i < period; i++) {
        sma += data[i].close;
    }
    sma = sma / period;
    emaArray.push({ time: data[period - 1].time, value: sma });
    
    let prevEma = sma;
    for (let i = period; i < data.length; i++) {
        const emaVal = data[i].close * k + prevEma * (1 - k);
        emaArray.push({ time: data[i].time, value: emaVal });
        prevEma = emaVal;
    }
    return emaArray;
}

// ───────────────────── Lightweight Charts Init
const domElement = document.getElementById('chart-container');
const chart = LightweightCharts.createChart(domElement, {
    autoSize: true,
    layout: {
        background: { type: 'solid', color: '#0c0f17' },
        textColor: '#f0f3fa',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        attributionLogo: false
    },
    grid: {
        vertLines: { color: 'rgba(43, 43, 67, 0.3)', style: LightweightCharts.LineStyle.Solid },
        horzLines: { color: 'rgba(43, 43, 67, 0.3)', style: LightweightCharts.LineStyle.Solid },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        vertLine: { color: '#787b86', width: 1, style: LightweightCharts.LineStyle.Dashed },
        horzLine: { color: '#787b86', width: 1, style: LightweightCharts.LineStyle.Dashed },
    },
    rightPriceScale: {
        borderColor: 'rgba(43, 43, 67, 0.5)',
    },
    timeScale: {
        borderColor: 'rgba(43, 43, 67, 0.5)',
        timeVisible: true,
    },
});

const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: true,
    borderColor: '#26a69a',
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    borderUpColor: '#26a69a',
    borderDownColor: '#ef5350',
});

// EMA 50 line series
const emaSeries = chart.addLineSeries({
    color: '#ff4a4a',
    lineWidth: 1.5,
    title: 'EMA (50)',
    priceLineVisible: false,
    lastValueVisible: false,
});

// ───────────────────── UI Active Lines Array
let currentPriceLines = [];

function clearPriceLines() {
    currentPriceLines.forEach(line => candlestickSeries.removePriceLine(line));
    currentPriceLines = [];
}

// ───────────────────── Yahoo Finance Symbol Mapping
function getYahooSymbol(sym) {
    // If it's a standard 6-character forex/metal symbol, append '=X' (unless it already contains '=' or '-')
    if (sym.length === 6 && !sym.includes('=') && !sym.includes('-') && !sym.includes('^')) {
        return sym + '=X';
    }
    return sym;
}

async function updateAllWatchlistPrices() {
    if (!realtimeDataEnabled) return;
    
    const symbols = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "XAGUSD"];
    const yahooSymbols = symbols.map(s => getYahooSymbol(s)).join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;
    
    try {
        const data = await fetchWithCORSProxy(url);
        if (data && data.quoteResponse && data.quoteResponse.result) {
            data.quoteResponse.result.forEach(quote => {
                let baseSym = quote.symbol.replace("=X", "");
                const watchPriceSpan = document.getElementById(`watch-${baseSym}`);
                if (watchPriceSpan && quote.regularMarketPrice !== undefined) {
                    const precision = ASSETS[baseSym] ? ASSETS[baseSym].precision : 5;
                    watchPriceSpan.innerText = quote.regularMarketPrice.toFixed(precision);
                }
            });
        }
    } catch (e) {
        console.warn("Failed to update watchlist prices:", e);
    }
}

// ───────────────────── CORS Proxy Rotation Fetcher
async function fetchWithCORSProxy(targetUrl) {
    const proxies = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
    ];

    for (let proxy of proxies) {
        try {
            const res = await fetch(proxy);
            if (res.ok) {
                const text = await res.text();
                const data = JSON.parse(text);
                if (data) {
                    return data;
                }
            }
        } catch (e) {
            console.warn(`Proxy failed: ${proxy}`, e);
        }
    }
    throw new Error("All CORS proxies failed to fetch target URL");
}

// ───────────────────── Technical Indicator Calculations (Real Data)
function calculateRSI(data, period = 14) {
    if (data.length <= period) return 50;
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
        const diff = data[i].close - data[i - 1].close;
        if (diff > 0) gains += diff;
        else losses -= diff;
    }
    
    let avgGain = gains / period;
    let avgLoss = losses / period;
    
    for (let i = period + 1; i < data.length; i++) {
        const diff = data[i].close - data[i - 1].close;
        let gain = diff > 0 ? diff : 0;
        let loss = diff < 0 ? -diff : 0;
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return Math.round(100 - 100 / (1 + rs));
}

function calculateATR(data, period = 14) {
    if (data.length <= period) return 0.001;
    
    const trs = [];
    for (let i = 1; i < data.length; i++) {
        const h = data[i].high;
        const l = data[i].low;
        const prevC = data[i - 1].close;
        const tr = Math.max(h - l, Math.abs(h - prevC), Math.abs(l - prevC));
        trs.push(tr);
    }
    
    let atr = 0;
    for (let i = 0; i < period; i++) {
        atr += trs[i];
    }
    atr /= period;
    
    for (let i = period; i < trs.length; i++) {
        atr = (atr * (period - 1) + trs[i]) / period;
    }
    
    return atr;
}

// ───────────────────── Mock / Simulated Data Generation Fallback
function generateMockHistory(symbol) {
    const assetInfo = ASSETS[symbol] || { name: symbol, precision: 5, basePrice: 1.0000, step: 0.00008, atr: 0.00075, cat: "Custom" };
    const precision = assetInfo.precision;
    const basePrice = assetInfo.basePrice || 1.0;
    const atr = assetInfo.atr || 0.00075;
    
    const count = 100;
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const intervalSeconds = 15 * 60; // 15m default
    let price = basePrice;
    
    for (let i = count; i > 0; i--) {
        const time = now - i * intervalSeconds;
        const change = (Math.random() - 0.5) * atr * 2;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * atr * 0.5;
        const low = Math.min(open, close) - Math.random() * atr * 0.5;
        
        data.push({
            time: time,
            open: parseFloat(open.toFixed(precision)),
            high: parseFloat(high.toFixed(precision)),
            low: parseFloat(low.toFixed(precision)),
            close: parseFloat(close.toFixed(precision))
        });
        price = close;
    }
    
    chartData = data;
    candlestickSeries.setData(chartData);
    
    // Calculate and display EMA (50)
    const emaData = calculateEMA(chartData, 50);
    emaSeries.setData(emaData);
    
    livePrice = price;
    const livePriceSpan = document.getElementById('ticker-price');
    if (livePriceSpan) {
        livePriceSpan.innerText = formatPrice(livePrice);
    }
    
    const watchPriceSpan = document.getElementById(`watch-${symbol}`);
    if (watchPriceSpan) {
        watchPriceSpan.innerText = formatPrice(livePrice);
    }
    
    const realRSI = calculateRSI(chartData);
    const realATR = calculateATR(chartData);
    document.getElementById('rsi-hud').innerText = realRSI;
    document.getElementById('atr-hud').innerText = realATR.toFixed(precision);
    
    if (ASSETS[symbol]) {
        ASSETS[symbol].atr = realATR;
    }
}

function simulateTick() {
    const symbol = currentSymbol;
    const assetInfo = ASSETS[symbol] || { name: symbol, precision: 5, basePrice: 1.0, step: 0.00008, atr: 0.00075, cat: "Custom" };
    const precision = assetInfo.precision;
    const atr = assetInfo.atr || 0.00075;
    
    // Generate random walk tick
    const change = (Math.random() - 0.5) * atr * 0.15;
    const simulatedPrice = parseFloat((livePrice + change).toFixed(precision));
    
    processNewLiveTick(symbol, simulatedPrice);
}

// ───────────────────── Real-time Data Updates (No Simulation)
async function updateChartWithRealData(symbol) {
    if (!realtimeDataEnabled) {
        generateMockHistory(symbol);
        return;
    }
    
    const yahooSym = getYahooSymbol(symbol);
    const tfConfig = TIMEFRAMES[currentTimeframe] || TIMEFRAMES["15m"];
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSym}?interval=${tfConfig.interval}&range=${tfConfig.range}`;
    
    try {
        const data = await fetchWithCORSProxy(targetUrl);
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];
        const opens = quote.open;
        const highs = quote.high;
        const lows = quote.low;
        const closes = quote.close;

        const formattedData = [];
        for (let i = 0; i < timestamps.length; i++) {
            if (opens[i] === null || highs[i] === null || lows[i] === null || closes[i] === null) {
                continue;
            }
            formattedData.push({
                time: timestamps[i],
                open: opens[i],
                high: highs[i],
                low: lows[i],
                close: closes[i]
            });
        }

        if (formattedData.length === 0) {
            throw new Error("No valid candles returned");
        }

        chartData = formattedData;
        candlestickSeries.setData(chartData);

        // Calculate and display EMA (50)
        const emaData = calculateEMA(chartData, 50);
        emaSeries.setData(emaData);
        
        const lastCandle = chartData[chartData.length - 1];
        const oldPrice = livePrice;
        livePrice = lastCandle.close;
        
        // Update UI Ticker Price
        const livePriceSpan = document.getElementById('ticker-price');
        livePriceSpan.innerText = formatPrice(livePrice);
        if (livePrice > oldPrice) {
            livePriceSpan.className = "ticker-val up";
        } else if (livePrice < oldPrice) {
            livePriceSpan.className = "ticker-val down";
        }

        // Update Watchlist Price in Sidebar
        const watchPriceSpan = document.getElementById(`watch-${symbol}`);
        if (watchPriceSpan) {
            watchPriceSpan.innerText = formatPrice(livePrice);
        }

        // Update HUD
        const realRSI = calculateRSI(chartData);
        const realATR = calculateATR(chartData);
        document.getElementById('rsi-hud').innerText = realRSI;
        const precision = (ASSETS[symbol] && ASSETS[symbol].precision !== undefined) ? ASSETS[symbol].precision : 5;
        document.getElementById('atr-hud').innerText = realATR.toFixed(precision);
        
        if (ASSETS[symbol]) {
            ASSETS[symbol].atr = realATR;
        }

        // Monitor active trade rules against the new real tick
        checkTradeConditions();

    } catch (error) {
        console.warn("Error updating real-time chart, falling back to simulated history candles:", error);
        generateMockHistory(symbol);
    }
}

// Timeframe switcher
async function setTimeframe(tf) {
    currentTimeframe = tf;
    
    // Update active class on buttons
    const buttons = document.querySelectorAll('.tf-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tf') === tf) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Reload active symbol with new timeframe data
    await changeAsset(currentSymbol);
}

// Initialize or Switch Asset Data
async function changeAsset(symbol) {
    currentSymbol = symbol;
    const assetInfo = ASSETS[symbol] || { name: symbol, precision: 5, basePrice: 1.0, step: 0.00008, atr: 0.00075, cat: "Custom" };
    
    document.getElementById('ticker-sym').innerText = symbol;
    document.getElementById('chart-asset-name').innerText = assetInfo.name;
    document.getElementById('ticker-price').innerText = "Laden...";
    
    // Update Finanzen.net Reference Link
    const finanzenLink = document.getElementById('finanzen-link');
    if (finanzenLink) {
        const url = FINANZEN_NET_URLS[symbol] || `https://www.finanzen.net/suchergebnis.asp?strSuchString=${symbol}`;
        finanzenLink.href = url;
    }
    
    clearPriceLines();
    activeTrade = null;
    
    // Set Precision configurations for Lightweight Charts
    candlestickSeries.applyOptions({
        priceFormat: {
            type: 'price',
            precision: assetInfo.precision,
            minMove: 1 / Math.pow(10, assetInfo.precision)
        }
    });

    // Initial load of real-time dataset
    await updateChartWithRealData(symbol);
    chart.timeScale().fitContent();
    
    updateRiskCalculatorHUD(null);

    // Subscribe to Forex.com live feed if enabled and asset has a mapped ID
    if (forexEnabled && FOREX_MARKET_IDS[symbol]) {
        subscribeToForexSymbol(symbol);
    }

    // Fetch instant MT5 tick if enabled
    if (mt5Enabled && mt5Token && mt5AccountId) {
        fetchMetaApiTick();
    }

    // Fetch instant Massive tick if enabled
    if (massiveEnabled && massiveApiKey) {
        fetchMassiveTick();
    }
}

// Live ticks updater
async function refreshRealtimeFeed() {
    if (!realtimeDataEnabled) {
        simulateTick();
        return;
    }
    
    // If Forex.com is active and streaming this symbol, do not poll Yahoo Finance!
    if (forexEnabled && forexClient && FOREX_MARKET_IDS[currentSymbol]) {
        return;
    }
    
    // If MT5 is active, poll MetaApi instead of Yahoo Finance!
    if (mt5Enabled && mt5Token && mt5AccountId) {
        await fetchMetaApiTick();
        return;
    }

    // If Massive is active, poll Massive instead of Yahoo Finance!
    if (massiveEnabled && massiveApiKey) {
        await fetchMassiveTick();
        return;
    }
    
    try {
        await updateChartWithRealData(currentSymbol);
    } catch (e) {
        console.warn("Failed to update real chart in loop, simulating tick:", e);
        simulateTick();
    }
}

function formatPrice(val) {
    if (val === undefined || val === null || isNaN(val)) return "-";
    const precision = (ASSETS[currentSymbol] && ASSETS[currentSymbol].precision !== undefined) 
        ? ASSETS[currentSymbol].precision 
        : 5;
    return val.toFixed(precision);
}

// ───────────────────── Risk Management Calculation & Lines Drawing
function updateRiskCalculatorHUD(trade) {
    if (!trade) {
        document.getElementById('calc-entry').innerText = "-";
        document.getElementById('calc-sl').innerText = "-";
        document.getElementById('calc-tp1').innerText = "-";
        document.getElementById('calc-tp2').innerText = "-";
        document.getElementById('calc-tp3').innerText = "-";
        return;
    }
    document.getElementById('calc-entry').innerText = formatPrice(trade.entry);
    document.getElementById('calc-sl').innerText = formatPrice(trade.sl);
    document.getElementById('calc-tp1').innerText = formatPrice(trade.tp1);
    document.getElementById('calc-tp2').innerText = formatPrice(trade.tp2);
    document.getElementById('calc-tp3').innerText = formatPrice(trade.tp3);
}

function triggerBreakout(type) {
    const assetInfo = ASSETS[currentSymbol] || { name: currentSymbol, precision: 5, basePrice: 1.0, step: 0.00008, atr: 0.00075, cat: "Custom" };
    const entry = livePrice;
    const atr = assetInfo.atr || 0.00075;
    const multiplier = 1.0; 
    const risk = atr * multiplier;
    
    let sl = 0;
    let tp1 = 0, tp2 = 0, tp3 = 0;
    
    if (type === 'LONG') {
        sl = entry - risk;
        tp1 = entry + risk * 1.0; 
        tp2 = entry + risk * 2.0; 
        tp3 = entry + risk * 3.0; 
    } else {
        sl = entry + risk;
        tp1 = entry - risk * 1.0;
        tp2 = entry - risk * 2.0;
        tp3 = entry - risk * 3.0;
    }

    // Create Trade Data
    activeTrade = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        symbol: currentSymbol,
        type: type,
        entry: entry,
        sl: sl,
        tp1: tp1,
        tp2: tp2,
        tp3: tp3,
        tp1_hit: false,
        tp2_hit: false,
        status: 'ACTIVE'
    };

    // Update Risk Table HUD
    updateRiskCalculatorHUD(activeTrade);

    // Draw Chart Price Lines
    clearPriceLines();
    
    // Entry Line
    currentPriceLines.push(candlestickSeries.createPriceLine({
        price: entry,
        color: '#2196f3',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dotted,
        axisLabelVisible: true,
        title: 'Einstieg (E)',
    }));
    
    // SL Line
    currentPriceLines.push(candlestickSeries.createPriceLine({
        price: sl,
        color: '#ef5350',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'Stop Loss (SL)',
    }));

    // TP1 Line
    currentPriceLines.push(candlestickSeries.createPriceLine({
        price: tp1,
        color: '#4db6ac',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'TP1 (1:1) - 33%',
    }));

    // TP2 Line
    currentPriceLines.push(candlestickSeries.createPriceLine({
        price: tp2,
        color: '#26a69a',
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'TP2 (1:2) - 33%',
    }));

    // TP3 Line
    currentPriceLines.push(candlestickSeries.createPriceLine({
        price: tp3,
        color: '#00695c',
        lineWidth: 2,
        lineStyle: LightweightCharts.LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'TP3 (1:3) - 34%',
    }));

    // Add trade to list and refresh history log UI
    tradesList.unshift(activeTrade);
    renderTradesTable();

    // Auto-send Telegram Signal
    const autosend = document.getElementById('tg-autosend').checked;
    if (autosend) {
        sendTelegramSignal(activeTrade);
    }
}

// Monitor and process trade updates dynamically
function checkTradeConditions() {
    if (!activeTrade || activeTrade.status !== 'ACTIVE') return;

    const price = livePrice;
    const type = activeTrade.type;
    let updateNeeded = false;
    
    if (type === 'LONG') {
        if (price <= activeTrade.sl) {
            activeTrade.status = 'SL HIT';
            updateNeeded = true;
        } else if (!activeTrade.tp1_hit && price >= activeTrade.tp1) {
            activeTrade.tp1_hit = true;
            activeTrade.status = 'TP1 HIT (+1R)';
            updateNeeded = true;
        } else if (activeTrade.tp1_hit && !activeTrade.tp2_hit && price >= activeTrade.tp2) {
            activeTrade.tp2_hit = true;
            activeTrade.status = 'TP2 HIT (+2R)';
            updateNeeded = true;
        } else if (activeTrade.tp2_hit && price >= activeTrade.tp3) {
            activeTrade.status = 'TP3 HIT (+3R)';
            updateNeeded = true;
        }
    } else { // SHORT
        if (price >= activeTrade.sl) {
            activeTrade.status = 'SL HIT';
            updateNeeded = true;
        } else if (!activeTrade.tp1_hit && price <= activeTrade.tp1) {
            activeTrade.tp1_hit = true;
            activeTrade.status = 'TP1 HIT (+1R)';
            updateNeeded = true;
        } else if (activeTrade.tp1_hit && !activeTrade.tp2_hit && price <= activeTrade.tp2) {
            activeTrade.tp2_hit = true;
            activeTrade.status = 'TP2 HIT (+2R)';
            updateNeeded = true;
        } else if (activeTrade.tp2_hit && price <= activeTrade.tp3) {
            activeTrade.status = 'TP3 HIT (+3R)';
            updateNeeded = true;
        }
    }

    if (updateNeeded) {
        if (activeTrade.status === 'SL HIT' || activeTrade.status === 'TP3 HIT (+3R)') {
            clearPriceLines();
            activeTrade = null;
        }
        renderTradesTable();
    }
}

// Render Active & History Trades Table
function renderTradesTable() {
    const tbody = document.getElementById('trades-tbody');
    if (tradesList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="empty-row">Keine aktiven Signale simuliert. Klicken Sie oben auf BUY/SELL Breakout.</td></tr>`;
        return;
    }

    tbody.innerHTML = tradesList.map(t => {
        let statusBadge = '';
        if (t.status === 'ACTIVE') {
            statusBadge = `<span class="badge active">Offen</span>`;
        } else if (t.status === 'SL HIT') {
            statusBadge = `<span class="badge loss">Loss (SL)</span>`;
        } else if (t.status.includes('TP3')) {
            statusBadge = `<span class="badge win">Win (TP3)</span>`;
        } else {
            statusBadge = `<span class="badge hit">${t.status}</span>`;
        }

        const precision = (ASSETS[t.symbol] && ASSETS[t.symbol].precision !== undefined) ? ASSETS[t.symbol].precision : 5;
        return `
            <tr>
                <td>${t.time}</td>
                <td>${t.symbol}</td>
                <td><span class="badge ${t.type.toLowerCase()}">${t.type}</span></td>
                <td>${t.entry.toFixed(precision)}</td>
                <td>${t.sl.toFixed(precision)}</td>
                <td>${t.tp1.toFixed(precision)}</td>
                <td>${t.tp2.toFixed(precision)}</td>
                <td>${t.tp3.toFixed(precision)}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function clearHistory() {
    tradesList = [];
    activeTrade = null;
    clearPriceLines();
    updateRiskCalculatorHUD(null);
    renderTradesTable();
}

// ───────────────────── Telegram Integration
function saveTgSettings() {
    const token = document.getElementById('tg-token').value;
    const chatid = document.getElementById('tg-chatid').value;
    const autosend = document.getElementById('tg-autosend').checked;
    
    localStorage.setItem('ptw_tg_token', token);
    localStorage.setItem('ptw_tg_chatid', chatid);
    localStorage.setItem('ptw_tg_autosend', autosend);
}

function loadTgSettings() {
    const token = localStorage.getItem('ptw_tg_token') || '';
    const chatid = localStorage.getItem('ptw_tg_chatid') || '';
    const autosend = localStorage.getItem('ptw_tg_autosend') === 'true';
    
    document.getElementById('tg-token').value = token;
    document.getElementById('tg-chatid').value = chatid;
    document.getElementById('tg-autosend').checked = autosend;
}

async function sendTelegramSignal(trade) {
    const token = document.getElementById('tg-token').value;
    const chatid = document.getElementById('tg-chatid').value;
    const logEl = document.getElementById('tg-log');

    if (!token || !chatid) {
        logEl.className = "tg-status error";
        logEl.innerText = "Fehler: Bot-Token und Chat ID fehlen!";
        return false;
    }

    const isLong = trade.type === 'LONG';
    const precision = (ASSETS[trade.symbol] && ASSETS[trade.symbol].precision !== undefined) ? ASSETS[trade.symbol].precision : 5;
    const text = 
`🚨 *BREAKOUT SIGNAL PRO* 🚨

📈 *Symbol:* ${trade.symbol} (${trade.type})
🚀 *Entry:* ${trade.entry.toFixed(precision)}
🛡️ *Stop Loss:* ${trade.sl.toFixed(precision)}

🎯 *Take Profit Level (1:3 CRV):*
▫️ *TP1 (1:1):* ${trade.tp1.toFixed(precision)} (33%)
▫️ *TP2 (1:2):* ${trade.tp2.toFixed(precision)} (33%)
▫️ *TP3 (1:3):* ${trade.tp3.toFixed(precision)} (34%)

⏰ *Uhrzeit:* ${trade.time} (Vienna Time)`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatid,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const resData = await response.json();
        if (response.ok && resData.ok) {
            logEl.className = "tg-status success";
            logEl.innerText = `Signal gesendet um ${new Date().toLocaleTimeString()}`;
            return true;
        } else {
            logEl.className = "tg-status error";
            logEl.innerText = `Telegram API Fehler: ${resData.description || 'Unbekannt'}`;
            return false;
        }
    } catch (err) {
        logEl.className = "tg-status error";
        logEl.innerText = `Netzwerkfehler: ${err.message}`;
        return false;
    }
}

function sendTestTelegram() {
    const mockTrade = {
        symbol: currentSymbol,
        type: 'LONG',
        entry: livePrice,
        sl: livePrice - ASSETS[currentSymbol].atr,
        tp1: livePrice + ASSETS[currentSymbol].atr * 1,
        tp2: livePrice + ASSETS[currentSymbol].atr * 2,
        tp3: livePrice + ASSETS[currentSymbol].atr * 3,
        time: new Date().toLocaleTimeString()
    };
    sendTelegramSignal(mockTrade);
}

// Real-time data toggle trigger
function toggleRealtimeData() {
    realtimeDataEnabled = document.getElementById('realtime-data-toggle').checked;
    localStorage.setItem('ptw_realtime_data', realtimeDataEnabled);
    changeAsset(currentSymbol);
}

function loadSettings() {
    loadTgSettings();
    
    const rtSetting = localStorage.getItem('ptw_realtime_data');
    realtimeDataEnabled = rtSetting !== 'false'; // Default to true
    document.getElementById('realtime-data-toggle').checked = realtimeDataEnabled;

    // Load Forex.com Settings
    forexEnabled = localStorage.getItem('ptw_fx_enabled') === 'true';
    if (forexEnabled) {
        connectToForexDotCom();
    }

    // Load MT5 Settings
    mt5Enabled = localStorage.getItem('ptw_mt5_enabled') === 'true';
    if (mt5Enabled) {
        connectToMT5();
    }

    // Load Massive Settings
    massiveEnabled = localStorage.getItem('ptw_massive_enabled') === 'true';
    if (massiveEnabled) {
        connectToMassive();
    }

    // Set connection text and toggle label depending on active feed
    const feedSource = localStorage.getItem('ptw_feed_source') || 'yahoo';
    const connText = document.querySelector('.conn-status');
    const toggleLabel = document.querySelector('.toggle-container.compact .toggle-label');
    
    if (toggleLabel) {
        if (feedSource === 'yahoo') {
            toggleLabel.innerText = "Echtzeit-Kurse (Finanzen.net)";
        } else if (feedSource === 'forex') {
            toggleLabel.innerText = "Echtzeit-Kurse (Forex.com Live)";
        } else if (feedSource === 'mt5') {
            toggleLabel.innerText = "Echtzeit-Kurse (MetaTrader 5 API)";
        } else if (feedSource === 'massive') {
            toggleLabel.innerText = "Echtzeit-Kurse (Massive.com API)";
        }
    }

    if (connText && feedSource === 'yahoo') {
        connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (Finanzen.net)`;
    }
}

// ───────────────────── MetaTrader 5 (MetaApi) Integration
async function connectToMT5() {
    if (!mt5Enabled) return;

    mt5Token = localStorage.getItem('ptw_mt5_token');
    mt5AccountId = localStorage.getItem('ptw_mt5_account_id');

    if (!mt5Token || !mt5AccountId) {
        console.warn("MetaApi (MT5) connection parameters are missing in settings.");
        return;
    }

    const connText = document.querySelector('.conn-status');
    if (connText) {
        connText.innerHTML = `<span class="conn-dot" style="background:var(--color-warning);"></span>Verbinde MT5 (MetaApi)...`;
    }

    const accountUrl = `https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${mt5AccountId}`;

    try {
        const res = await fetch(accountUrl, {
            method: 'GET',
            headers: { 
                'auth-header': mt5Token,
                'auth-token': mt5Token 
            }
        });
        const data = await res.json();
        if (res.ok && (data._id || data.id)) {
            mt5Region = data.region || 'new-york';
            console.log(`MT5 Account connected. Name: ${data.name}, Region: ${mt5Region}, Status: ${data.connectionStatus}`);
            
            if (connText) {
                connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (MT5 Live - ${data.name})`;
            }

            // Immediately poll tick for current symbol
            fetchMetaApiTick();
        } else {
            console.error("MetaApi account fetch failed:", data.message || "Unknown error");
            if (connText) {
                connText.innerHTML = `<span class="conn-dot" style="background:var(--color-short);"></span>MT5 Verbindung fehlgeschlagen`;
            }
        }
    } catch (e) {
        console.error("Error connecting to MetaApi:", e);
        if (connText) {
            connText.innerHTML = `<span class="conn-dot" style="background:var(--color-short);"></span>MT5 Netzwerkfehler`;
        }
    }
}

async function fetchMetaApiTick() {
    if (!mt5Enabled || !mt5Token || !mt5AccountId) return;
    
    const symbol = currentSymbol;
    const url = `https://mt-client-api-v1.${mt5Region}.agiliumtrade.ai/users/current/accounts/${mt5AccountId}/symbols/${symbol}/current-price`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'auth-token': mt5Token,
                'auth-header': mt5Token
            }
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data && (data.bid || data.ask)) {
                const price = (data.bid + data.ask) / 2;
                processNewLiveTick(symbol, price);
                
                const connText = document.querySelector('.conn-status');
                if (connText) {
                    connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (MT5 Live - ${symbol})`;
                }
            }
        } else {
            console.error(`MT5 tick fetch error: Status ${res.status}`);
            const connText = document.querySelector('.conn-status');
            if (connText) {
                connText.innerHTML = `<span class="conn-dot" style="background:var(--color-short);"></span>MT5 Fehler - Fallback auf Finanzen.net`;
            }
            await updateChartWithRealData(symbol);
        }
    } catch (e) {
        console.error("Error fetching MT5 tick:", e);
        await updateChartWithRealData(symbol);
    }
}

// ───────────────────── Massive.com Integration
async function connectToMassive() {
    if (!massiveEnabled) return;

    massiveApiKey = localStorage.getItem('ptw_massive_apikey');

    if (!massiveApiKey) {
        console.warn("Massive.com API Key is missing in settings.");
        return;
    }

    const connText = document.querySelector('.conn-status');
    if (connText) {
        connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (Massive.com Live)`;
    }

    // Immediately poll tick for current symbol
    fetchMassiveTick();
}

async function fetchMassiveTick() {
    if (!massiveEnabled || !massiveApiKey) return;
    
    const symbol = currentSymbol;
    // Format to Massive.com standard (e.g. C:EUR-USD)
    let massiveSymbol = symbol;
    if (symbol.length === 6) {
        massiveSymbol = 'C:' + symbol.substring(0, 3) + '-' + symbol.substring(3);
    } else {
        massiveSymbol = 'C:' + symbol;
    }
    
    const url = `https://api.massive.com/v3/quotes/${massiveSymbol}?apiKey=${massiveApiKey}&limit=1`;

    try {
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            if (data && data.status === "OK" && data.results && data.results.length > 0) {
                const quote = data.results[0];
                const price = (quote.bid_price + quote.ask_price) / 2;
                
                processNewLiveTick(symbol, price);
                
                const connText = document.querySelector('.conn-status');
                if (connText) {
                    connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (Massive.com Live - ${symbol})`;
                }
            } else {
                console.warn(`Massive symbols quotes empty response for ${massiveSymbol}:`, data);
            }
        } else {
            console.error(`Massive tick fetch error: Status ${res.status}`);
            const connText = document.querySelector('.conn-status');
            if (connText) {
                connText.innerHTML = `<span class="conn-dot" style="background:var(--color-short);"></span>Massive Fehler - Fallback auf Finanzen.net`;
            }
            await updateChartWithRealData(symbol);
        }
    } catch (e) {
        console.error("Error fetching Massive tick:", e);
        await updateChartWithRealData(symbol);
    }
}


// ───────────────────── Forex.com Lightstreamer Integration
async function connectToForexDotCom() {
    if (!forexEnabled) return;

    const username = localStorage.getItem('ptw_fx_username');
    const password = localStorage.getItem('ptw_fx_password');
    const appkey = localStorage.getItem('ptw_fx_appkey');
    const server = localStorage.getItem('ptw_fx_server') || 'demo';

    if (!username || !password || !appkey) {
        console.warn("Forex.com connection parameters are missing in settings.");
        return;
    }

    const baseUrl = server === 'live' 
        ? 'https://ciapi.marketpartners.com/ServiceAPI'
        : 'https://ciapipreprod.marketpartners.com/ServiceAPI';

    const url = `${baseUrl}/session`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    try {
        const res = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                UserName: username,
                Password: password,
                AppKey: appkey
            })
        });

        const data = await res.json();
        if (res.ok && data.Session) {
            forexSessionToken = data.Session;
            console.log("Forex.com Session established. Token:", forexSessionToken);
            
            const streamerUrl = server === 'live'
                ? 'https://push.cityindex.com/'
                : 'https://pushpreprod.cityindex.com/';

            // Initialize Lightstreamer Client
            forexClient = new Lightstreamer.LightstreamerClient(streamerUrl, "STREAMINGALL");
            forexClient.connectionDetails.setUser(username);
            forexClient.connectionDetails.setPassword(forexSessionToken);

            forexClient.addListener({
                onStatusChange: function(status) {
                    console.log("Forex.com Streamer status:", status);
                    const connText = document.querySelector('.conn-status');
                    if (connText) {
                        if (status.startsWith("CONNECTED")) {
                            connText.innerHTML = `<span class="conn-dot" style="background:#81c784;"></span>Echtzeit-Datenfeed (Forex.com Live)`;
                        } else if (status === "CONNECTING") {
                            connText.innerHTML = `<span class="conn-dot" style="background:var(--color-warning);"></span>Verbinde Forex.com...`;
                        } else {
                            connText.innerHTML = `<span class="conn-dot" style="background:var(--color-short);"></span>Forex.com getrennt`;
                        }
                    }
                }
            });

            forexClient.connect();
            subscribeToForexSymbol(currentSymbol);
        } else {
            console.error("Forex.com login failed:", data.ErrorMessage);
        }
    } catch (e) {
        console.error("Error connecting to Forex.com API:", e);
    }
}

function subscribeToForexSymbol(symbol) {
    if (!forexClient || !forexSessionToken) return;

    if (forexSubscription) {
        forexClient.unsubscribe(forexSubscription);
        forexSubscription = null;
    }

    const marketId = FOREX_MARKET_IDS[symbol];
    if (!marketId) {
        console.warn(`Symbol ${symbol} has no pre-mapped Forex.com Market ID. Streaming via Yahoo Finance instead.`);
        return;
    }

    forexSubscription = new Lightstreamer.Subscription("MERGE", `PRICE.${marketId}`, ["MarketId", "Bid", "Offer", "Price"]);
    forexSubscription.setDataAdapter("PRICES");
    forexSubscription.setRequestedSnapshot("yes");

    forexSubscription.addListener({
        onItemUpdate: function(updateInfo) {
            const bidVal = parseFloat(updateInfo.getValue("Bid"));
            const offerVal = parseFloat(updateInfo.getValue("Offer"));
            const priceVal = parseFloat(updateInfo.getValue("Price"));
            const currentPrice = priceVal || (bidVal + offerVal) / 2;
            
            if (!isNaN(currentPrice)) {
                processNewLiveTick(symbol, currentPrice);
            }
        }
    });

    forexClient.subscribe(forexSubscription);
    console.log(`Subscribed to Forex.com Market ID: ${marketId} (PRICE.${marketId})`);
}

function processNewLiveTick(symbol, currentPrice) {
    const lastBar = chartData[chartData.length - 1];
    const now = Math.floor(Date.now() / 1000);
    const oldPrice = livePrice;
    livePrice = currentPrice;

    const livePriceSpan = document.getElementById('ticker-price');
    if (livePriceSpan) {
        livePriceSpan.innerText = formatPrice(livePrice);
        if (livePrice > oldPrice) {
            livePriceSpan.className = "ticker-val up";
        } else if (livePrice < oldPrice) {
            livePriceSpan.className = "ticker-val down";
        }
    }

    const watchPriceSpan = document.getElementById(`watch-${symbol}`);
    if (watchPriceSpan) {
        watchPriceSpan.innerText = formatPrice(livePrice);
    }

    if (lastBar) {
        if (now - lastBar.time >= 900) {
            const newBar = {
                time: lastBar.time + 900,
                open: livePrice,
                high: livePrice,
                low: livePrice,
                close: livePrice
            };
            chartData.push(newBar);
            candlestickSeries.update(newBar);
        } else {
            lastBar.close = livePrice;
            lastBar.high = Math.max(lastBar.high, livePrice);
            lastBar.low = Math.min(lastBar.low, livePrice);
            candlestickSeries.update(lastBar);
        }
    }

    checkTradeConditions();
}

// ───────────────────── Event Listeners & Loops
// Resize Chart
window.addEventListener('resize', () => {
    // Lightweight Charts autoSize: true handles resizing automatically.
    // We fit the content scale on resize.
    chart.timeScale().fitContent();
});

// Initialize Page
loadSettings();
populateSymbolDropdown();
selectSymbol("EURUSD");

// Loop ticks every 4 seconds (4000ms)
setInterval(refreshRealtimeFeed, 4000);
