var ipfsAPI = require('ipfs-api')

var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')


ipfs.block.get('QmTxpP3VqHWxViX1GdCVJ2jRJ7Nn2URyTS44Kgo6jg8vXq')
    .then(function (id) {
        console.log('my id is: ', id)
    })
    .catch(function(err) {
        console.log('Fail: ', err)
    })