const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const logger = require("./logger/index");
const database = require("./models");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
require("dotenv").config();
const server = http.createServer(app);
// creating socket io instance
var io = socketio(server);
 
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/web/messenger", require("./routes/web/messenger/conversation"));
app.use("/api/authentication", require("./routes/authentication/authentication"));
const PORT = process.env.PORT || 3306;

process.on('uncaughtException',(ex)=>{
    console.log(ex);
    logger.error(ex.message, ex);
    process.exit(1);
});
process.on('unhandledRejection',(ex)=>{
    console.log(ex);
    logger.error(ex.message, ex);
    process.exit(1);
});

database.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        logger.info(`Server is running`);
    });
}).catch(err => {
    logger.error(err.message, err);
});