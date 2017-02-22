'use strict';
var xdnWallet = require('../lib/wallet');

describe('xdnWallet', () => {
    const Wallet = new xdnWallet();

    describe('constructor', () => {
        it('should have default host set to `127.0.0.1`', () => {
            new xdnWallet().hostname.should.equal('127.0.0.1');
        });

        it('should have default port set to 42081', () => {
            new xdnWallet().port.should.equal(42081);
        });
    });

    describe('methods', () => {
        describe('balance()', () => {
            it('should retrieve the account balance', (done) => {
                Wallet.balance().then(function(result){
                    result.balance.should.be.a.Number();
                    done();
                })
            })
        })

        //XDN does not have this RPC method :(
        // describe('address()', () => {
        //     it('should return the account address', (done) => {
        //         Wallet.address.then(function(result){
        //             result.address.should.be.a.String();
        //             done();
        //         })
        //     })
        // })
    })
})
