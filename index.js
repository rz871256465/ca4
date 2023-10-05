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

    // Send a system message to notify the user to join the room
    const systemMessage = `${data} join the room`;
    io.emit("system message", systemMessage);
  });

  socket.on("user connected", function (data) {
    console.log("User connected:", data);
  // Handle user connection events, update the user list or perform other actions
  });

  socket.on("disconnect", function () {
    const disconnectedUserId = socket.userId;
    console.log("User disconnected:", disconnectedUserId); // Add logs to check disconnected usernames

    // Deleting a user's socket ID
    delete activeUsers[disconnectedUserId];

    if (disconnectedUserId) {
        // Building System Messages
        const systemMessage = `${disconnectedUserId} left the room`;

        // Sends a system message to all connected clients
        io.emit("system message", systemMessage);

        // Emit the updated list of active users to all connected clients
        io.emit("user disconnected", disconnectedUserId);
    }
});


  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });


  // Listen for "typing" events from the client.
socket.on("typing", (username) => {
    socket.broadcast.emit("user typing", username);
});

// Listen for "stop typing" events from the client.
socket.on("stop typing", (username) => {
    socket.broadcast.emit("user stop typing", username);
});
});