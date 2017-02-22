'use strict';
var http = require('http');

class Wallet {
    constructor(hostname, port) {
        this.hostname = hostname || '127.0.0.1';
        this.port = port || 42081;
    }
}

// general API wallet request
Wallet.prototype._request = function (body) {
    // encode the request into JSON
    let requestJSON = JSON.stringify(body);

    // set basic headers
    let headers = {};
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = Buffer.byteLength(requestJSON, 'utf8');

    // make a request to the wallet
    let options = {
        hostname: this.hostname,
        port: this.port,
        path: '/json_rpc',
        method: 'POST',
        headers: headers
    };
    let requestPromise = new Promise((resolve, reject) => {
        let data = '';
        let req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', function() {
                let body = JSON.parse(data);
                if(body && body.result) {
                    resolve(body.result);
                } else if (body && body.error) {
                    resolve(body.error);
                } else {
                    resolve('Wallet response error. Please try again.');
                }
            });
        });
        req.on('error', (e) => resolve(e));
        req.write(requestJSON);
        req.end();
    });

    return requestPromise;
};

// build request body
Wallet.prototype._body = function (method, params) {
    let body = {
        jsonrpc: '2.0',
        id: '0',
        method: method,
        params: params
    };
    return this._request(body);
};

/**
 * Wallet Methods
 * @type {Wallet}
 */

// returns the wallet balance
Wallet.prototype.balance = function() {
    let method = 'getbalance';
    return this._body(method);
};

//not supported in XDN simplewallet :(
// return the wallet address
// Wallet.prototype.address = function() {
//     let method = 'getaddress';
//     return this._body(method);
// };

//TO-DO revise for XDN
// transfer Monero to a single recipient, or a group of recipients
Wallet.prototype.transfer = function(destinations, options) {
    if(typeof options === 'undefined') options = {};
    if(typeof destinations === 'array') {
        destinations.forEach((dest) => dest.amount = convert(dest.amount));
    } else {
        destinations.amount = convert(destinations.amount);
        destinations = [destinations];
    }
    let method = 'transfer';
    let params = {
        destinations: destinations,
        mixin: parseInt(options.mixin) || 4,
        unlock_time: parseInt(options.unlockTime) || 0,
        payment_id: options.pid || null
    };
    return this._body(method, params);
};

//Research and impment "store" RPC method, assuming XDN deposit feature
// Wallet.prototype.store = function(pid) {
//     let method = 'store';
//     let params = {};
//     return this._body(method, params);
// };


// get a list of incoming payments using a given payment ID
Wallet.prototype.getPayments = function(pid) {
    let method = 'get_payments';
    let params = {};
    params.payment_id = pid;
    return this._body(method, params);
};

// get a list of incoming messages
Wallet.prototype.getMessages = function() {
    let method = 'get_messages';
    let params = {};
    return this._body(method, params);
};

// get a list of all transfers
Wallet.prototype.getTransfers = function() {
    let method = 'get_transfers';
    let params = {};
    return this._body(method, params);
};

// return the current block height
Wallet.prototype.height = function() {
    let method = 'getheight';
    return this._body(method);
};

// (Rescan wallet) Discard cache data and start synchronizing from the start
Wallet.prototype.reset = function() {
    let method = 'reset';
    return this._body(method);
};

module.exports = Wallet;

//To-DO double check for XDN
// helper function to convert amount to atomic units
function convert(amount) {
    let number = Number(amount) * 1e12;
    // remove any decimals
    number = number.toFixed(0);
    return Number(number);
}
