const experss = require('express')
const app = experss()
const port = process.env.PORT || 3000
const server = app.listen(port)
const { Server } = require('socket.io')
const io = new Server().listen(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', (socket) => {
  console.log('user connected')

  socket.on('on-donate', (data) => {
    // console.log(data)
    io.sockets.emit('user-donate', data)
  })
})

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })