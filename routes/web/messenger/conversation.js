const express = require("express");
const router = express.Router();
asyncHandler = require("../../../middleware/asyncHandler");
verifyUserToken = require("../../../middleware/verifyUserToken");
const models = require("../../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post(
  "/conversation/:recieverID",
  [verifyUserToken],
  asyncHandler(async (req, res) => {
    const { recieverID } = req.params;
    const userId = req.user.id;
    console.log(userId);
    sender_user = await models.users.findAll({
      where: {
        user_id: req.user.id,
      },
    });
    if (sender_user.length < 1) {
      return res.status(401).send({
        message:
          "you are not loggedin please try again after login with your account",
      });
    }
    reciever_user = await models.users.findAll({
      where: {
        user_id: recieverID,
      },
    });
    if (reciever_user.length < 1) {
      return res.status(404).send({
        message: "no such user was found",
      });
    }
    const senderName = sender_user[0].first_name + " " + sender_user[0].last_name.toUpperCase();
    const recieverName = reciever_user[0].first_name + " " + reciever_user[0].last_name.toUpperCase();
    let existingConversation = await models.conversations.findAll({
      where: {
        members:[userId,recieverID],
      },
    });
    if (existingConversation.length< 1) {
      existingConversation = await models.conversations.findAll({
        where: {
          members:[recieverID,userId],
        },
      });
    }
    if (existingConversation.length>0) {
      return res.status(200).send({
        message: "conversation already exists",
        conversation: existingConversation[0],
      });
    }
    let newConversation = await models.conversations.create({
      members: [req.user.id, recieverID],
      members_name:[senderName,recieverName],
    });
    return res.status(200).send({
      message: "conversation created successfully",
      conversation: newConversation,
    });
  })
);
router.get(
  "/conversation",
  [verifyUserToken],
  asyncHandler(async (req, res) => {
    const senderID = req.user.id;
    sender_user = await models.users.findAll({
      where: {
        user_id: senderID,
      },
    });
    if (sender_user.length < 1) {
      return res.status(401).send({
        message:
          "you are not loggedin please try again after login with your account",
      });
    }
    // get conversations of sender user where senderID is in array of members
    const conversations = await models.conversations.findAll({
      where: {
        members: {
          [Op.contains]: [senderID],
        },
      },
    });
    if (conversations.length < 1) {
      return res.status(404).send({
        message: "no conversations found",
        conversations: [],
      });
    }
    return res.status(200).send({
      message: "conversations found",
      conversations: conversations,
    });
  })
);
router.post(
  "/messages",
  [verifyUserToken],
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { conversationID, message,messageType } = req.body;
    console.log(conversationID);
    const senderID = req.user.id;
    sender_user = await models.users.findAll({
      where: {
        user_id: senderID,
      },
    });
    if (sender_user.length < 1) {
      return res.status(401).send({
        message:
          "you are not loggedin please try again after login with your account",
      });
    }
    const conversation = await models.conversations.findAll({
      where: {
        conversation_id: conversationID,
      },
    });
    if (conversation.length < 1) {
      return res.status(404).send({
        message: "no such conversation found",
      });
    }
    if (!conversation[0].members.includes(senderID)) {
      return res.status(401).send({
        message: "you are not allowed to send message to this conversation",
      });
    }
    const newMessages = await models.messages.create({
      conversation_id: conversationID,
      sender_id: senderID,
      message: message,
      message_type: messageType,
    });
    const conversationMessage = await models.messages.findAll({
      where: {
        conversation_id: conversationID.toString(),
      },
    });
    return res.status(200).send({
      message: "message created successfully",
      newMessages: conversationMessage,
    });
  })
);
router.get(
  "/messages/:conversationID",
  [verifyUserToken],
  asyncHandler(async (req, res) => {
    const senderID = req.user.id;
    const conversations = await models.conversations.findAll({
      where: {
        members: {
          [Op.contains]: [senderID],
        },
      },
    });
    if (conversations.length < 1) {
      return res.status(404).send({
        message: "no conversations found",
      });}
    const conversationMessage = await models.messages.findAll({
      where: {
        conversation_id: req.params.conversationID.toString(),
      },
    });
    if (conversationMessage.length < 1) {
      return res.status(404).send({
        message: "no messages found",
      });
    }
    return res.status(200).send({
      message: "messages found",
      conversationMessage: conversationMessage,
    });
  })
);
module.exports = router;
