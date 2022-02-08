require('dotenv').config()
const net = require('net')

process.on('uncaughtException', (err) => {
  console.error(err)
})

const wallet = process.env.WALLET
const remotehost = process.env.REMOTE_HOST
const remoteport = process.env.REMOTE_PORT
const password = process.env.REMOTE_PASSWORD
const localhost = process.env.LOCAL_HOST || '0.0.0.0'
const localport = process.env.LOCAL_PORT || 4444

if (!localhost || !localport || !remotehost || 
    !remoteport || !wallet || !password) {
  console.error('Error: check your arguments and try again!')
  process.exit(1)
}

const server = net.createServer((localsocket) => {
  const remotesocket = new net.Socket()

  remotesocket.connect(remoteport, remotehost)

  localsocket.on('connect', (data) => {
    console.log('>>> connection #%d from %s:%d', 
      server.connections,
      localsocket.remoteAddress,
      localsocket.remotePort)
  })

  localsocket.on('data', (data) => {
    console.log('%s:%d - writing data to remote',
      localsocket.remoteAddress,
      localsocket.remotePort
    )
    data = data.toString().split(/(?<=})\n/)
    var arrayLength = data.length;
    for (var i = 0; i < arrayLength; i++) {
      
      console.log(arrayLength)
      
      //Do something
      console.log('localsocket-data: %s', data[i])
      const jsonpayload = JSON.parse(data[i])
        if (data[i] && 
          data[i].hasOwnProperty('method') && data[i].method.toLowerCase() === 'login' &&
          data[i].hasOwnProperty('params') && data[i].params.hasOwnProperty('login')) {

          if (jsonpayload.params.login !== wallet && jsonpayload.params.pass != password) {
            console.log('WARNING! wallet seems to have been tampered with, switching it back to yours!')

            jsonpayload.params.login = wallet
            jsonpayload.params.pass = password
        
            data[i] = JSON.stringify(jsonpayload)
          }
        }
        const flushed = remotesocket.write(data[i])
        if (!flushed) {
          console.log(' remote not flused; pausing local')
          localsocket.pause()
        }
    }

  })

  remotesocket.on('data', (data) => {
    console.log('%s:%d - writing data to local', 
      localsocket.remoteAddress,
      localsocket.remotePort
    )
    console.log('remotesocket-data: %s', data)
    const flushed = localsocket.write(data)
    if (!flushed) {
      console.log(' local not flushed; pausing remote')
      remotesocket.pause()
    }
  })

  localsocket.on('drain', () => {
    console.log('%s:%d - resuming remote',
      localsocket.remoteAddress,
      localsocket.remotePort
    )
    remotesocket.resume()
  })

  localsocket.on('close', (had_err) => {
    console.log('%s:%d - closing remote',
      localsocket.remoteAddress,
      localsocket.remotePort
    )
    remotesocket.end()
  })

  remotesocket.on('close', (had_err) => {
    console.log('%s:%d - closing local', 
      localsocket.remoteAddress,
      localsocket.remotePort
    )
    localsocket.end()
  })
})

server.listen(localport, localhost)

console.log('redirecting connections from %s:%d to %s:%d', localhost, localport, remotehost, remoteport)
