const experss = require('express')
const app = experss()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  // console.log('user connected')

  socket.on('on-donate', (data) => {
    // console.log(data)
    io.emit('user-donate', data)
  })
})

server.listen(3000, () => {
  console.log("Listening on port 3000")
})