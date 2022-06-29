import fetch from "node-fetch"
import CryptoJS from "crypto-js"

const SPOT_KEY = "some key";
const SPOT_SECRET = "some secret key";

function SIGNED_REQUEST(method, url, params, key, secret) {
	var total_params = params.toString();
	var signature = CryptoJS.HmacSHA256(total_params, secret).toString(CryptoJS.enc.Hex);
	params.append('signature', signature);
	return fetch(url + params, {
		method: method,
		headers: {
			'X-MBX-APIKEY': key,
		},
	}).then(data => data.json());
}

// Get the price of ETH-USDT
var ts = Date.now();
var url = "https://api.binance.com/api/v3/ticker/price?" + (new URLSearchParams({"symbol": "ETHUSDT"})).toString();
fetch(url)
.then(response => response.json())
.then(data => console.log(data));


// Get account balances
ts = Date.now();
const time_params = new URLSearchParams({"timestamp": ts});
const account = SIGNED_REQUEST(
	'GET',
	"https://testnet.binance.vision/api/v3/account?",
	time_params,
	SPOT_KEY,
	SPOT_SECRET
);
account.then(d=>console.log(d['balances']));


// Trade
ts = Date.now();
var buy_params = new URLSearchParams({'symbol': 'ETHUSDT', 'side': 'BUY', 'type': 'MARKET', 'quantity': 0.1, 'timestamp': ts});
const trade = SIGNED_REQUEST(
	'POST',
	'https://testnet.binance.vision/api/v3/order?',
	buy_params,
	SPOT_KEY,
	SPOT_SECRET
);
trade.then(console.log);