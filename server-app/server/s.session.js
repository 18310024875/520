// express-session 模块 ;
const session = require('express-session');

module.exports = (
	session({
	    secret: "my-secret",
	    resave: true,
	    saveUninitialized: true,
	    // 默认过期0秒
	    // cookie:{
	    // 	maxAge:60000000000
	    // }
	})
);