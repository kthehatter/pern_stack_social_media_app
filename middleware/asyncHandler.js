const logger = require('../logger/index');
module.exports=function (handler){
    return async (req, res, next)=>{
    try {
        await handler(req, res);
    } catch (ex) {
        logger.error(ex.message, ex);
        res.status(500).send({status:'500',message:'Internal server error'});
    }}
};