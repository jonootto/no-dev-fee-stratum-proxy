var b = new Buffer('eyJpZCI6MCwicmVzdWx0IjpbIjB4NmUwZmZiYTk1NWIzYzBiMWRjYzM3MzM3MjNjNjJlYjM4MjBhMGZiZWExMThiZDQ4NWFiYjliYmQ4ODdkNGI0MCIsIjB4ZGVlOTk4NGQwNmNkYzY3OTI1ZWM1OGRjNjhmZDUwNTZjNDE3NGIxMzI5ZDgyYmU1YTQ1NjQyNDE3M2IzZmQ0ZSIsIjB4MDAwMDAwMDExMmUwYmU4MjZkNjk0YjJlNjJkMDE1MTFmMTJhNjA2MWZiYWVjOGJjMDIzNTc1OTNlNzBlNTJiYSIsIjB4ZDg0N2RhIl0sImVycm9yIjpudWxsfQ==','base64')
var s = b.toString();
data = s


data = data.toString().split(/(?<=})\n/)

var arrayLength = data.length;

    for (var i = 0; i < arrayLength; i++) {

      
      //Do something
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
        console.log('localsocket-data: %s', data[i])
        //const flushed = remotesocket.write(data[i])
        //if (!flushed) {
        //  console.log(' remote not flused; pausing local')
        //  localsocket.pause()
        //}
    }