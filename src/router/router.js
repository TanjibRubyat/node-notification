const express = require("express");
const router = express.Router();
const {
  list,
  change_status,
  store,
  update,
  get_by_user_id,
  destroy,
} = require("../controllers/notificationController");

//////////////////// routers  start ////////////////

router.route("/notifications-list").post(list);
router.route("/change-status").post(change_status);
router.route("/follow-up").post(store);
router.route("/follow-up-update/:id").put(update);
router.route("/follow-up-by-user").post(get_by_user_id);
router.route("/delete-notification").post(destroy);

//////////////////// routers  end ////////////////

module.exports = router;
