const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./logger/index");
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
app.use("/api/web/messenger", require("./routes/web/messenger/conversation"));
app.use("/api/authentication", require("./routes/authentication/authentication"));
const PORT = process.env.PORT || 3306;

database.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running`);
    });
}).catch(err => {
    logger.error(err.message, err);
});