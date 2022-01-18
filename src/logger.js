const logger = {};

logger.info = function() {
    console.log.apply( console, arguments );
};

logger.error = function() {
    console.log.apply( console, arguments );
};

logger.debug = function() {
    console.log.apply( console, arguments );
};

logger.warn = function() {
    console.log.apply( console, arguments );
};

module.exports = logger;
