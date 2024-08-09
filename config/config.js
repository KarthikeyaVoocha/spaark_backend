require('dotenv').config();

module.exports = {
    mongoURI: 'mongodb://localhost:27017/spaarksDB',
    jwtSecret: process.env.JWT_SECRET || 'yourSecretKey',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
};
