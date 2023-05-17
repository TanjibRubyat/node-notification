const express = require("express");
const axios = require("axios");
const { createConnection } = require("mysql");
const connection = require("../../db/db");
const { isExists } = require("date-fns");

const store = (req, res) => {
  // console.log(req.body)
  const title = req.body.title;
  const start = req.body.start;
  const end = req.body.end;
  const description = req.body.description;
  const user_id = req.body.user_id;
  const priority = req.body.priority;

  const sql =
    "insert into follow_ups (title,start,end,description,user_id,priority) values(?,?,?,?,?,?)";
  connection.query(
    sql,
    [title, start, end, description, user_id, priority],
    (err, results) => {
      console.log(results.affectedRows);
      if (err) {
        res.status(500).json({
          message: "failed",
          status: 500,
        });
      } else {
        res.status(201).json({
          message: "inserted",
          status: 201,
        });
      }
    }
  );
};

const update = (req, res) => {
  const title = req.body.title;
  const start = req.body.start;
  const end = req.body.end;
  const description = req.body.description;
  const user_id = req.body.user_id;
  const priority = req.body.priority;

  const sql =
    "update follow_ups set title=?,start=?,end=?,description=?,user_id=?,priority=?,status=? where id = ?";
  connection.query(
    sql,
    [
      title,
      start,
      end,
      description,
      user_id,
      priority,
      req.body.status,
      req.params.id,
    ],
    (err, results) => {
      console.log(results.affectedRows);
      if (err) {
        res.status(500).json({
          message: "failed",
          status: 500,
        });
      } else {
        if (results.affectedRows > 0) {
          const sql_fetch = "select * from follow_ups where id = ?";
          connection.query(sql_fetch, [req.params.id], (err, response) => {
            if (err) {
              res.status(500).json({
                message: "failed",
                status: 500,
              });
            } else {
              res.status(201).json({
                message: "inserted",
                status: 201,
                data: response,
              });
            }
          });
        } else {
          res.status(500).json({
            message: "failed",
            status: 500,
          });
        }
      }
    }
  );
};

const get_by_user_id = (req, res) => {
  // console.log(req.body.user_id)
  const sql = "select * from follow_ups where user_id=?";
  connection.query(sql, [req.body.user_id], (err, results) => {
    // console.log(results)
    if (err) {
      res.status(500).json({
        message: "failed",
        status: 500,
      });
    } else {
      if (results != "") {
        res.status(200).json({
          message: "success",
          status: 200,
          data: results,
        });
      } else {
        res.status(404).json({
          message: "not found",
          status: 404,
        });
      }
    }
  });
};

const list = (req, res) => {
  var current_date_time = new Date();
  var sql =
    "select * from follow_ups where user_id=? and start<? order by created_at desc";
  // console.log(sql);
  connection.query(
    sql,
    [req.body.user_id, current_date_time],
    (err, results) => {
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
          res.status(200).json({
            message: "success",
            data: results,
          });
        }
      }
    }
  );
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

const destroy = (req, res) => {
  const sql =
    "update follow_ups set delete_status=? where id=? and delete_status=?";
  connection.query(sql, [0, req.body.id, 1], (err, results) => {
    console.log(results.affectedRows);
    if (err) {
      res.status(403).json({
        message: "already destroyed",
        status: 403,
      });
    } else {
      if (results.affectedRows > 0) {
        const fetch_sql = "select * from follow_ups where id=?";
        connection.query(fetch_sql, [req.body.id], (err, response) => {
          if (response) {
            res.status(201).json({
              message: "success",
              status: 201,
              data: response,
            });
          } else {
            res.status(500).json({
              message: "server error",
              status: 500,
            });
          }
        });
      } else {
        res.status(403).json({
          message: "already destroyed",
          status: 403,
        });
      }
    }
  });
};

module.exports = {
  list,
  change_status,
  store,
  update,
  get_by_user_id,
  destroy,
};
