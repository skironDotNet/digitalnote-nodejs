var xdnWallet = require('./lib/wallet');
var Wallet = new xdnWallet();

// examples

// Wallet.integratedAddress().then(function(result){
//     console.log(result);
// });

// Wallet.balance().then(function(response){
//     console.log(response);
// });
//
// Wallet.address().then(function(response){
//     console.log(response);
// });
//
// Wallet.height().then(function(height){
//     console.log(height);
// });
//
Wallet.getTransfers().then(function(result){
    console.log(result);
});

//var destination = {};
//destination.address = 'ddcgpCXeQ5JSyuKtGPBMwoZZfwpbyeGxi2xtpmyqRJ9i8otyo29rdNGGUteGPWb5y5V6dkLHuzZJCMSV4P53EE6r1nAjbMSNo';
//destination.amount = 1;
//
//Wallet.transfer(destination).then(function(result){
//    console.log(result);
//});



