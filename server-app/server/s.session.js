// express-session 模块 ;
const session = require('express-session');

module.exports = (
	session({
	    secret: "my-secret",
	    resave: true,
	    saveUninitialized: true,
	    // socket中好像不好使 ;;; 
	    cookie:{
	    	maxAge:60000000000
	    }
	})
);