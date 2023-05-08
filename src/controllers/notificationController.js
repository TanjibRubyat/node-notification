const express = require("express");
const axios = require("axios");
const { createConnection } = require("mysql");
const connection = require("../../db/db");
const { isExists } = require("date-fns");

const list = (req, res) => {
  var current_date_time = new Date();
  //   console.log(current_date_time);
  // exit()
  const dates = new Array();
  axios
    .get("http://localhost:8000/api/notifications-list", {
      user_id: req.body.user_id,
      start: current_date_time,
    })
    .then((response) => {
      //   console.log(response.data.data);
      for (let i = 0; i < response.data.length; i++) {
        console.log(response.data[i].data);
      }

      res.status(200).json({
        message: "success",
        data: response.data.data,
      });
    });
  // exit()
  //   var sql = "select * from follow_ups where user_id=? and start<?";
  //   // console.log(sql);
  //   connection.query(
  //     sql,
  //     [req.body.user_id, current_date_time],
  //     (err, results) => {
  //       if (err) {
  //         res.status(500).json({
  //           message: "failed",
  //         });
  //       } else {
  //         if (results == "") {
  //           res.status(404).json({
  //             message: "not found",
  //           });
  //         } else {
  //           res.status(200).json({
  //             message: "success",
  //             data: results,
  //           });
  //         }
  //       }
  //     }
  //   );
};

const change_status = (req, res) => {
  const sql = "update follow_ups set status=? where id=? and status=?";
  connection.query(sql, [0, req.body.id, 1], (err, results) => {
    // console.log(results);

    if (err) {
      res.status(500).json({
        message: "failed",
      });
    } else {
      if (results == "") {
        res.status(404).json({
          message: "not found",
        });
      } else {
        const sql1 = "select * from follow_ups where id=" + req.body.id;
        connection.query(sql1, (err, results) => {
          res.status(200).json({
            message: "success",
            data: results,
          });
        });
      }
    }
  });
};

module.exports = { list, change_status };
