// create the service that handle the request to the server for authentication

import axios from "axios";
const authBaseURL = "http://localhost:3306/api/authentication/"
export const userLoginApiCall = async (email, password) => {
  const body = { email, password }
  const accessPoint = authBaseURL+"user/login";
  return await axios
    .post(accessPoint, body)
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const userTokenValidationApiCall = async (accessToken) => {
  const accessPoint = authBaseURL+"user/verify";
  return await axios
    .post(accessPoint, { },{headers:{
      "Content-Type": "application/json",
      accessToken: accessToken
    }})
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}