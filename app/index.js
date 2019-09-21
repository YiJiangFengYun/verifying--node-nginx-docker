const log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = 'debug';
setInterval(() => {
    logger.info("This is a application.");
}, 1000);