const express = require("express");
const http = require("http");
const { createConnection } = require("mysql");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
var mysql = require("mysql");
const connection = require("./db/db");
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
const router = require("./src/router/router");
// const { exit } = require("process");
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
  console.log("Connected", socket?.id);
  socket.on("message", (msg) => {
    console.log("msg", msg.user_id);

    var time = new Array();
    var id = msg.user_id;
    const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
    axios
      .get(`https://crmuser.quadque.digital/api/user-details-socket/${id}`)
      // .get(`http://localhost:8000/api/user-details-socket/${id}`)
      .then((response) => {
        // console.log(response.data.data);
        let results = response.data.data;
        // console.log(JSON.stringify(results));
        //   exit()
        for (let i = 0; i < results.length; i++) {
          var date = results[i].start;
          var today = new Date();
          var date = new Date(date);
          var today_date =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
          // console.log(today_date)
          var date_from_db =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
          
          if (today_date == date_from_db) {
            // console.log(today);
            // console.log(new Date(date));
            if (today < new Date(date) && today > new Date(date.setMinutes(date.getMinutes() - 10))
            ) {
              
              time.push(results[i]);
            }
          }
        }
        // console.log(time)
        io.emit("message", time);
      });
  });
});

//////////////////////////// socket.io notification end//////////////////////////

app.use("/api", router);

server.listen(5000, () => {
  console.log("listening on *: http://localhost:5000");
});
