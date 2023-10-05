const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

// Use an object to store active users with their socket IDs
const activeUsers = {};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    console.log("New user connected:", data);
    socket.userId = data;

    // Store the user's socket ID in the activeUsers object
    activeUsers[data] = { socketId: socket.id, room: 'default-room' };

    // Emit the list of active users to the newly connected user
    socket.emit("new user", Object.keys(activeUsers));

    // Broadcast the new user to all connected clients
    io.emit("user connected", Object.keys(activeUsers));

    // 发送系统消息，通知用户加入房间
    const systemMessage = `${data} join the room`;
    io.emit("system message", systemMessage);
  });

  socket.on("user connected", function (data) {
    console.log("User connected:", data);
  // 处理用户连接事件，更新用户列表或执行其他操作
  });

  socket.on("disconnect", function () {
    const disconnectedUserId = socket.userId;
    console.log("User disconnected:", disconnectedUserId); // 添加日志以检查断开连接的用户名

    // 删除用户的 socket ID
    delete activeUsers[disconnectedUserId];

    if (disconnectedUserId) {
        // 构建系统消息
        const systemMessage = `${disconnectedUserId} left the room`;

        // 发送系统消息给所有连接的客户端
        io.emit("system message", systemMessage);

        // Emit the updated list of active users to all connected clients
        io.emit("user disconnected", disconnectedUserId);
    }
});


  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });


  // 监听客户端发送的 "typing" 事件
socket.on("typing", (username) => {
    socket.broadcast.emit("user typing", username);
});

// 监听客户端发送的 "stop typing" 事件
socket.on("stop typing", (username) => {
    socket.broadcast.emit("user stop typing", username);
});
});