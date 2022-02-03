const express = require("express");
const router = express.Router();
asyncHandler = require("../../../middleware/asyncHandler");
const models = require("../../../models");

router.post("/conversation/:recieverID",asyncHandler(async (req, res) => {
  const { recieverID } = req.params;
  const { senderID } = req.body;
  sender_user = models.users.findAll({
    where: {
      user_id: senderID,
    },
  });
  if (sender_user.length < 1) {
    return res.status(404).send({
      message:
        "you are not loggedin please try again after login with your account",
    });
  }
  reciever_user = models.users.findAll({
    where: {
      user_id: recieverID,
    },
  });
  if (reciever_user.length < 1) {
    return res.status(404).send({
      message: "no such user was found",
    });
  }
  const conversation = models.conversations.create({
    members: [senderID, recieverID],
  });
  return res.status(200).send({
    message: "conversation created successfully",
    conversation:conversation,
  });
}));

router.get("/conversation", asyncHandler(async(req, res) => {
const { senderID } = req.body;
    sender_user = models.users.findAll({
        where: {
            user_id: senderID,
        },
    });
    if (sender_user.length < 1) {
        return res.status(404).send({
            message:
                "you are not loggedin please try again after login with your account",
        });
    }
    // get conversations of sender user where senderID is in array of members
    const conversations = models.conversations.findAll({
        where: {
            members: {
                [Op.contains]: [senderID],
            },
        },
    });

}));
    

module.exports = router;
