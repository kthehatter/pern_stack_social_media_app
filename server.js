const express = require("express");
const cors = require("cors");
const app = express();
const database = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
// creating http instance
var http = require("http").createServer(app);
// creating socket io instance
var io = require("socket.io")(http);
 
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3306;

database.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("app is running");
    });
}).catch(err => {
    console.log(err);
});