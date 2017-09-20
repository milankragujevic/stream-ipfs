const MediaElementWrapper = require('mediasource')
const VideoStream = require('videostream')
const bl = require('bl')
const Ipfs = require('ipfs')

console.log('OK init')

const ipfs = new Ipfs({
    init: true,
    start: true,
    repo: 'ipfs-milankragujevic-' + Math.round(Date.now() / 1000).toString(),
    config: {
        /*Swarm: [
            "/ip4/139.59.143.89/tcp/4002/ws"
        ]*/
    }
})

ipfs.on('error', (err) => {
  console.log('ERR ipfs')
  console.error(err)
})

ipfs.on('ready', (err) => {
    if (err) {
        throw err
    }
    console.log('OK ready')
    ipfs.files.cat('QmTrpoNL8YAZq4PN23ZYkKzNH9qdVs71G5AReNTatwiP1W', (err, readable) => {
        if(err) {
          throw err;
        }
        console.log('OK cat')


        var elem = document.getElementsByTagName('video')[0];

        var wrapper = new MediaElementWrapper(elem)
        var writable = wrapper.createWriteStream('video/webm; codecs="vp8, vorbis"')

        elem.addEventListener('error', function () {
          var errorCode = elem.error
          var detailedError = wrapper.detailedError
          console.log('ERR element')
          console.error(errorCode, detailedError)
        })

        writable.on('error', function (err) {
          console.log('ERR writable')
          console.error(err)
        })

        readable.pipe(writable)

    })
})
