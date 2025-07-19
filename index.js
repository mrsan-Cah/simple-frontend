io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ username, roomId }) => {
    socket.join(roomId);
    socket.data.username = username;
    socket.data.room = roomId;

    io.to(roomId).emit("user-connected", {
      sender: "System",
      text: `${username} joined room ${roomId}`,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("send-message", (msg) => {
    const roomId = socket.data.room;
    const time = new Date().toLocaleTimeString();
    io.to(roomId).emit("receive-message", {
      sender: socket.data.username,
      text: msg,
      time,
      id: socket.id,
    });
  });

  socket.on("typing", () => {
    socket.broadcast.to(socket.data.room).emit("user-typing", socket.data.username);
  });

  socket.on("send-file", ({ fileName, fileData }) => {
    io.to(socket.data.room).emit("receive-file", {
      sender: socket.data.username,
      fileName,
      fileData,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    const time = new Date().toLocaleTimeString();
    io.to(socket.data.room).emit("user-disconnected", {
      sender: "System",
      text: `${socket.data.username} left the chat`,
      time,
    });
  });
});
