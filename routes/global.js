const MongoClient = require('mongodb').MongoClient;

exports.node_env = process.env.NODE_ENV;
exports.site_url = process.env.SITE_URL;
exports.DB_URL = process.env.DB_URL;
exports.DB_NAME = process.env.DB_NAME;
exports.TIME_ZONE = "+05:30";