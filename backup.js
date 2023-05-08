io.on("connection", (socket) => {
  console.log("Connected", socket?.id);
  socket.on("message", (msg) => {
    // console.log("msg", msg.user_id);

    var time = new Array();
    var id = msg.user_id;
    const options = { timeZone: "Asia/Dhaka", timeZoneName: "short" };
    // axios
    //   .get("http://localhost:8000/api/user-details", {
    //     user_id: id,
    //   })
    //   .then((res) => {
    //       let results = res;
    //       return results
    //   });
    console.log(results);
    var sql = "SELECT * FROM follow_ups where user_id=? and status=?";
    connection.query(sql, [id, 1], (err, results) => {
      // console.log(err);
      if (!err) {
        for (var i = 0; i < results.length; i++) {
          if (results[i].start != null) {
            var date = results[i].start;
            var today = new Date();
            //   console.log(date);
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
            //   console.log(today_date);
            // console.log("date_from_db");
            if (today_date == date_from_db) {
              // console.log(results[i].start);
              var data = results[i].start.toLocaleTimeString("en-US", options, {
                hour12: false,
              });
              //   console.log(data);
              //   var hourMinute = data.getHours() + ":" + data.getMinutes();
              var hours = data.split(":")[0];
              var minutes = data.split(":")[1];

              var real_hour_min = hours + ":" + data.split(":")[1];
              var hourMinute = hours + ":" + minutes;
              //   console.log(hourMinute);
              // console.log(minut.getMinutes());
              var todayhours = today.getHours() % 12 || 12;
              var todayMinutes = today.getMinutes() + 10;

              if (
                today < new Date(date) &&
                today > new Date(date.setMinutes(date.getMinutes() - 10))
              ) {
                time.push(results[i]);

                // console.log(msg);
              }
              // }
            }
          }
        } ///for loop end
        console.log("time", time);
        io.emit("message", time);
      } else {
        return res.status(500).json(err);
      }
    });
    // });
  });
});
