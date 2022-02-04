import axios from "axios";
const authBaseURL = "http://localhost:3306/api/web/messenger/";
const accessToken = localStorage.getItem("accessToken");
export const fetchConversationsApiCall = async () => {
  const accessPoint = authBaseURL + "conversation";
  return await axios
    .get(
      accessPoint,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: accessToken,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
export const fetchChatMessagesApiCall = async (conversationID) => {
  const accessPoint = authBaseURL + "messages/"+conversationID.toString();
  return await axios
    .get(
      accessPoint,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: accessToken,
        },
      }
    )
    .then((res) => {
      console.log("messages", res);
      return res;
    })
    .catch((err) => {
      return err;
    });
}

export const sendChatMessageApiCall = async (conversationID,message,messageType) => {
  const accessPoint = authBaseURL + "messages";
  return await axios
    .post(
      accessPoint,
      {
        conversationID: conversationID,
        message: message,
        messageType: messageType,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: accessToken,
        },
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}