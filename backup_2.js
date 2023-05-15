const express = require("express");
const http = require("http");
// const { createConnection } = require("mysql");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
// var mysql = require("mysql");
// const connection = require("./db/db");
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
const router = require("./src/router/router");
const cors = require("cors");
const { exit } = require("process");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

//////////////////////////// socket.io notification start//////////////////////////
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  },
});

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

io.on("connection", (socket) => {
  // console.log("Connected", socket?.id);
  socket.on("message", (msg) => {
    console.log("msg", msg.user_id);

    var time = new Array();
    var id = msg.user_id;
    // const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
    const socket_notifier = async () => {
      try {
        const result = await axios(
          `https://crmuser.quadque.digital/api/user-details-socket/${id}`
        );
        const results = result.data.data;
        // let results = response.data.data;
        console.log(results);
        for (let i = 0; i < results.length; i++) {
          var date = new Date(results[i].start);
          var today = new Date();
          var today_date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          var date_from_db =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
          console.log(today_date);
          console.log(date_from_db);
          if (today_date == date_from_db) {
            console.log("here");
            if (
              new Date(results[i].start) >= new Date() &&
              new Date(results[i].start).setMinutes(
                new Date(results[i].start).getMinutes() - 10
              ) <= new Date()
            ) {
              console.log("timezone");
              time.push(results[i]);
            }
          }
        }
        io.emit("message", time);
      } catch (error) {
        console.log(error);
      }
      // });
    };
    socket_notifier();
  });
});

//////////////////////////// socket.io notification end//////////////////////////

server.listen(5000, () => {
  console.log("listening");
});
