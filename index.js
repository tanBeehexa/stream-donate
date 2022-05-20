const experss = require('express')
const app = experss()
var cors = require('cors')
app.use(cors())
const port = process.env.PORT || 3000
const server = app.listen(port)
const { Server } = require('socket.io')
const io = new Server().listen(server)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

const cors_proxy = require('cors-anywhere');
var host = process.env.HOST || '0.0.0.0';
cors_proxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: [
    'cookie',
    'cookie2',
    // Strip Heroku-specific headers
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
    // Other Heroku added debug headers
    // 'x-forwarded-for',
    // 'x-forwarded-proto',
    // 'x-forwarded-port',
  ],
  redirectSameOrigin: true,
}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port);

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  io.sockets.on('connection', (socket) => {
    console.log('user connected')

    socket.on('on-donate', (data) => {
      // console.log(data)
      io.sockets.emit('user-donate', data)
    })

    socket.on('on-donate-countdown', (data) => {
      let counter = data.counter;
      let WinnerCountdown = setInterval(() => {
        console.log("chay", counter)
        io.sockets.emit('counter', counter);
        counter--
        if (counter === 0) {
          io.sockets.emit('user-donate-finish')
          clearInterval(WinnerCountdown);
        }
      }, 1000);
    })
  })
});



// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })