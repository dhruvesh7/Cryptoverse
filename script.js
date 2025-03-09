document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const networkStatus = document.getElementById("networkstatus");
    const tableBody = document.querySelector("#crypto-table tbody");
    let cryptoData = [
        { name: "Bitcoin", price: 48500, change: "+2.5%" },
        { name: "Ethereum", price: 3200, change: "-1.2%" }
    ];
    // Function to check network status
    function updateNetworkStatus() {
        if (navigator.onLine) {
            networkStatus.textContent = "🟢 Online Mode (Fetching LiveData)";
            fetchCryptoData();
        } else {
            networkStatus.textContent = "🔴 Offline Mode (Using StoredData) ";
            displayCryptoData(cryptoData);
        }
    }
    // Fetch live crypto data
    function fetchCryptoData() {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency = usd & order=market_cap_desc & per_page=5 & page=1")
            .then(response => response.json())
            .then(data => {
                cryptoData = data.map(coin => ({
                    name: coin.name,
                    price: `$${coin.current_price.toLocaleString()}`,
                    change:
                        `${coin.price_change_percentage_24h.toFixed(2)}%`
                }));
                displayCryptoData(cryptoData);
            })
            .catch(() => {
                networkStatus.textContent = "⚠️ Failed to load live data.Using offline mode.";
                displayCryptoData(cryptoData);
            });
    }
    // Display crypto data
    function displayCryptoData(data) {
        tableBody.innerHTML = "";
        data.forEach(coin => {
            let row = `<tr>
    <td>${coin.name}</td>
    <td>${coin.price}</td>
    <td class="${coin.change.includes('-') ? 'negative' :
                    'positive'}">${coin.change}</td>
    </tr>`;
            tableBody.innerHTML += row;
        });
    }
    // Dark Mode Toggle
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        themeToggle.textContent =
            document.body.classList.contains("light-mode") ? "🌞 Light Mode" :
                "🌙 Dark Mode";
    });
    // Check network on load and listen for changes
    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
});