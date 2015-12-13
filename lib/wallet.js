var request = require('request');

// constructor
function Wallet(host, port) {
    this.hostname = host || 'http://127.0.0.1',
    this.port = port || '18082',
    this.path = '/json_rpc'
}

Wallet.prototype = {
    constructor: Wallet,

    // general API request
    request: function(body, callback) {
        var options = {
            url: this.hostname + ':' + this.port + this.path,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: body,
            json: true
        };
        request.post(options, function(err, res, body){
            callback(err, body.result);
        });
        return this;
    },

    // generate body of request
    body: function(method, params, callback) {
        var body = {
            jsonrpc: '2.0',
            id: '0',
            method: method
        };
        if(params){
            body.params = params;
        }
        return this.request(body, callback);
    },

    /*
    WALLET METHODS
     */

    // return the wallet balance
    balance: function(callback) {
        var method = 'getbalance';
        return this.body(method, null, callback);
    },

    // return the wallet address
    address: function(callback) {
        var method = 'getaddress';
        return this.body(method, null, callback);
    },

    // transfer Monero to a single recipient
    transfer: function(destination, amount, options, callback) {
        if(typeof options === 'function') {
            callback = options;
            options = {};
        }
        var method = 'transfer';
        var destination = {
            amount: parseInt(amount) * 1e12,
            address: destination
        };
        var params = {
            destinations: [destination],
            mixin: parseInt(options.mixin) || 4,
            unlock_time: parseInt(options.unlockTime) || 0,
            payment_id: options.pid || null
        };
        return this.body(method, params, callback)
    },

    // transfer Monero to a group of recipients

    // split a transfer into more than one tx if necessary

    // send all dust outputs back to the wallet, to make them easier to spend and mix
    sweep: function(callback) {
        var method = 'sweep_dust';
        return this.body(method, null, callback);
    },

    // get a list of incoming payments using a given payment ID
    getPayments: function(pid, callback) {
        var method = 'get_payments';
        var params = {
            payment_id: pid
        };
        return this.body(method, params, callback);
    },

    // get a list of incoming payments using a single payment ID or list of payment IDs from a given height
    getBulkPayments: function(pids, minHeight, callback) {
        var method = 'get_bulk_payments';
        var params = {
            payment_ids: pids,
            min_block_height: minHeight
        };
        return this.body(method, params, callback);
    },

    // return a list of incoming transfers to the wallet (type can be "all", "available", or "unavailable")
    incomingTransfers: function(type, callback) {
        var method = 'incoming_transfers';
        var params = {
            transfer_type: type
        };
        return this.body(method, params, callback);
    },

    // return the spend or view private key (type can be 'mnemonic' seed or 'view_key')
    queryKey: function(type, callback) {
        var method = 'query_key';
        var params = {
            key_type: type
        };
        return this.body(method, params, callback);
    },

    // make an integrated address from the wallet address and a payment id
    integratedAddress: function(pid, callback) {
        if(typeof pid === 'function') {
            callback = pid;
            pid = null;
        }
        var method = 'make_integrated_address';
        var params = {
            payment_id: pid
        };
        return this.body(method, params, callback);
    },

    // retrieve the standard address and payment id corresponding to an integrated address
    splitIntegrated: function(address, callback) {
        var method = 'split_integrated_address';
        var params = {
            integrated_address: address
        };
        return this.body(method, params, callback);
    }
};


module.exports = Wallet;