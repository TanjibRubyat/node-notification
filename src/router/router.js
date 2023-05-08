const express = require("express");
const router = express.Router();
const {list,change_status} = require("../controllers/notificationController");


//////////////////// routers  start ////////////////

// router.route("/notifications-list").get(list);
// router.route("/change-status").get(change_status);

//////////////////// routers  end ////////////////

module.exports = router;
