var topology = require('fully-connected-topology')
var jsonStream = require('duplex-json-stream')
var streamSet = require('stream-set')

var toPort = require('hash-to-port')

var me = process.argv[2]
var friends = process.argv.slice(3)

var swarm = topology(toAddress(me), friends.map(toAddress))
var streams = streamSet()

var id = Math.random()

swarm.on('connection', function(friend){
    console.log('[a friend joined]')
    friend = jsonStream(friend)
    streams.add(friend)

    friend.on('data', function(data){
        console.log(data.username + '>' + data.message)
    })

})


process.stdin.on('data', function(data){
    streams.forEach(function(friend){
        friend.write({
            username: me, 
            message: data.toString().trim()
        })
    })
})

function toAddress (name) {
    return 'localhost:' + toPort(name)
}