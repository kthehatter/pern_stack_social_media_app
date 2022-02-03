const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const sharp = require('sharp');
const asyncHandler = require("../../middleware/asyncHandler");
const models = require("../../models");
const jwtGenerator = require("../../utilities/jwtGenerator");
const { check, validationResult } = require("express-validator");
const verifyUserToken = require("../../middleware/verifyUserToken");
const multer = require("multer");
const upload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Please upload an image'))
      }

      cb(undefined, true)
  }
})

router.post(
  "/user/register",
  [
    check("firstName", "First Name is required").isLength({ min: 3 }),
    check("lastName", "Last Name is required").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()[0].msg);
      return res
        .status(400)
        .send({ status: "400", message: errors.array()[0].msg, token: "" });
    }
    const { firstName, lastName, email, password } = req.body;
    let timeToLoggedIn = "240h";
    const userEmail = await models.users.findAll({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (userEmail.length > 0) {
      return res
        .status(401)
        .send({ status: "401", message: "Email already exist!", token: "" });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    let newUser = await models.users.create({
      first_name: firstName,
      last_name: lastName,
      email: email.trim().toLowerCase(),
      password: bcryptPassword,
      profile_picture: "",
    });
    const jwtToken = jwtGenerator(newUser.user_id, timeToLoggedIn);
    return res
      .status(200)
      .send({ status: "200", message: "Success", token: jwtToken });
  })
);
router.post(
  "/user/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    var time_to_logged_in = "504h";
    let user = await models.users.findAll({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
    if (user.length === 0) {
      return res.status(401).send({
        status: "401",
        message: "You provided an invalid email address or password",
        token: "",
      });
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).send({
        status: "401",
        message: "You provided an invalid email address or password",
        token: "",
      });
    }
    const accessToken = jwtGenerator(user[0].user_id, time_to_logged_in);
    return res
      .status(200)
      .send({ status: "200", message: "Success", token: accessToken });
  })
);
router.post(
  "/user/verify",
  verifyUserToken,
  asyncHandler(async (req, res) => {
    console.log("verified");
    return res.status(200).json({ status: "200", message: " Success" });
  })
);
router.post(
  "/user/profile/uploadpicture",
  [verifyUserToken,upload.single("avatar")],
  asyncHandler(async (req, res) => {
    userProfileImage= await sharp(req.file.buffer).resize({ width: 250, height: 250 }).jpeg().toBuffer();
    const binaryPhoto = Buffer.from(userProfileImage).toString('binary')
    const base64Photo = Buffer.from(binaryPhoto).toString('base64')
    let user = await models.users.update({
      profile_picture: userProfileImage
    },{
      where: {
        user_id: req.user.id
      }
    });

    return res.status(200).json({ status: "200", message: " Success" });
  }),(error, req, res, next) => {
    res.status(400).send({ status:'400',message: error.message })
}
);
router.get('/users/:id/avatar', asyncHandler( async (req, res) => {
      const user = await models.users.findAll({
        where: {
          user_id: req.params.id
        },
      });
      console.log(user[0]);
      if (!user || !user[0].profile_picture) {
          throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(user[0].profile_picture)
}));
module.exports = router;
