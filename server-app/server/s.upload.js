const path=require('path');

// multer 模块 ;
const multer = require('multer');

module.exports = (
	multer({
		dest: path.join(__dirname , '..' , './tmp_uploads'),
		limits:{
			fileSize:104857600
		}
	})
);