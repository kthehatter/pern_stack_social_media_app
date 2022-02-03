const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWTSECRET = process.env.JWTSECRET;

function jwtGenerator(user_id,time_to_logged_in) {
  const payload = {
    user: {
      id: user_id
    }
  };
  
//the code below was the code written from the tutorial
//Look at file server/routes/dashboard.js to see the change code for this code
  
//   function jwtGenerator(user_id) {
//   const payload = {
//     user: user_id
//   };

  return jwt.sign(payload, JWTSECRET, { expiresIn: time_to_logged_in });
}

module.exports = jwtGenerator;
