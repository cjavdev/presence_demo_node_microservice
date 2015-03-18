var http = require('http'),
  static = require('node-static'),
  file = new static.Server('./'),
  _ = require('lodash');

// http server
var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});
server.listen(process.env.PORT || 8000);

// socket.io
var io = require('socket.io')(server);
var users = {};
function login(socket, data) {
  users[socket.id] = data;
}
function logout(socket) {
  delete users[socket.id];
}
io.on('connection', function (socket) {
  socket.on('register', function (data) {
    login(socket, data);
    io.sockets.emit('online_users', _.values(users));
  });
  socket.on('disconnect', function () {
    logout(socket);
    io.sockets.emit('online_users', _.values(users));
  });
});
