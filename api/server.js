// server için gerekli olanları burada ayarlayın

// posts router'ını buraya require edin ve bağlayın

const express = require("express");

const server = express();
const cors = require("cors");

server.use(express.json());
server.use(cors());
const postsRouter = require("./posts/posts-router");

server.use("/api/posts", postsRouter);

// server.get("/", (req, res) => {
//   res.send("Server is up and running!...");
// });

module.exports = server;
