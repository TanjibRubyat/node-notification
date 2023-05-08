const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
var mysql = require("mysql");
// const con = require("./db/db");
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
// const { exit } = require("process");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    // methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

const io = new Server({
  cors: {
    origin: "*",
  },
});

app.use(bodyParser.json());
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "crm_notification",
// });
// const employees = db.get("employees");
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
  // res.sendFile("./index.html");
  //   var id = 32;
  //   var data = new Array();
  //   const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
  //   //   var query = "SELECT * FROM follow_ups where user_id=?";
  //   axios
  //     .post("http://localhost:8000/api/user-details", {
  //       user_id: id,
  //     })
  //     .then((res) => {
  //       // data.push(res.data.data)
  //       data = JSON.parse(res.data.data);
  //       for (var i = 0; i < res.data.length; i++) {
  //         console.log(res.data[i].data);
  //       }
  //       console.log(data[0].start);
  //     });
});

// app.get("/api/user", (req, res) => {
//   var query =
//     "insert into follow_ups('title','start','end','description','user_id','priority','status') values ('hello world','3:00','4:00',23,1,1) ";
//   con.query(query, (err, results) => {
//     if (!err) return res.status(200).json(results);
//     else return res.status(500).json(err);
//   });
// });

// console.log(req.body);
// exit()
// cron.schedule("0 */1 * * * *", function () {
//   function broadcast() {
/////////////db connection start//////////////
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crm_notification",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

/////////////db connection end//////////////

io.on("connection", (socket) => {
  console.log("socket", socket.id);
  socket.on("message", (msg) => {
    console.log(msg);
    var time = new Array();
    var id = msg;
    const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
    var query = "SELECT * FROM follow_ups where user_id=?";
    con.query(query, [id, null], (err, results) => {
      if (!err) {
        // return res.status(200).json(results);
        for (var i = 0; i < results.length; i++) {
          if (results[i].start != null) {
            var date = results[i].start;
            var today = new Date();
            // console.log("here")
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
            // console.log("here")
            if (today_date == date_from_db) {
              var only_date = date.toString();

              var today_date_to_string = today.toString();
              //   console.log(today_date_to_string)
              //   if (today_date_to_string == only_date) {
              //   console.log(today)
              //   exit()

              // console.log(only_date);
              var data = results[i].start.toLocaleTimeString("en-US", options);
              //   var hourMinute = data.getHours() + ":" + data.getMinutes();
              var hours = data.split(":")[0];
              var minutes = data.split(":")[1];
              // console.log(minutes)
              var real_hour_min = hours + ":" + data.split(":")[1];
              // console.log(real_hour_min)
              // var ten_min_earlier = minutes - 10
              // console.log(ten_min_earlier);
              // var ten_min_before_time = hours+':'+ten_min_earlier
              var hourMinute = hours + ":" + minutes;
              //   console.log(hourMinute);

              var todayhours = today.getHours();
              var todayMinutes = today.getMinutes() + 10;
              if (todayMinutes > 60) {
                todayhours = todayhours + 1;
              }
              var todayhourMinute = todayhours + ":" + todayMinutes;
              //   console.log(todayhourMinute);
              // hourMinute = 5;
              // todayhourMinute = 5;

              msg = "You have a meeting at " + real_hour_min;
              if (todayhourMinute === hourMinute) {
                io.emit("message", msg);

                // console.log(msg);
              }
              // }
            }
            // console.log(todayMinutes);
            // time.push(hourMinute);
          }
        }
        // console.log(time);
      } else {
        return res.status(500).json(err);
      }
    });
    // });
  });
});
//   }
//   broadcast();
//   console.log("hello");
// io.emit('message','hello')
// });

io.listen(5000);

// server.listen(5000, () => {
//   console.log("listening on *: http://localhost:5000");
// });

// const { Server } = require("socket.io");

// const io = new Server({
//   cors: {
//     origin: "*",
//   },
// });

// let onlineUsers = [];

// const addNewUser = (username, socketId) => {
//   !onlineUsers.some((user) => user.username === username) &&
//     onlineUsers.push({ username, socketId });
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// const getUser = (username) => {
//   return onlineUsers.find((user) => user.username === username);
// };

// io.on("connection", (socket) => {
//   console.log("Something Connected", socket?.id);
//   io.to(socket.id).emit("emsg", "We have a meeting");
//   //   socket.on("newUser", (username) => {
//   //     addNewUser(username, socket.id);
//   //   });

//   //   socket.on("sendNotification", ({ senderName, receiverName, type }) => {
//   //     const receiver = getUser(receiverName);
//   //     io.to(receiver.socketId).emit("getNotification", {
//   //       senderName,
//   //       type,
//   //     });
//   //   });

//   //   socket.on("sendText", ({ senderName, receiverName, text }) => {
//   //     const receiver = getUser(receiverName);
//   //     io.to(receiver.socketId).emit("getText", {
//   //       senderName,
//   //       text,
//   //     });
//   //   });

//   socket.on("disconnect", () => {
//     console.log("Something Disconnected");
//     // removeUser(socket.id);
//   });
// });

// io.listen(5000);
