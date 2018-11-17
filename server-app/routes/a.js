var express = require('express');
var router = express.Router();



router.all('/a', (req, res, next)=>{
    console.log(2)
    console.log(req);
    req.session['lllll'] = 'lllllll';
    res.send( '111' )
})
router.all('/b', (req, res, next)=>{
    console.log(req);
    res.send( '222' )
})





// QUERY(`SELECT * FROM kkk`)
// .then(res=>{
// 	log(1,res)
// })
// .then(
// 	()=>QUERY(`INSERT kkk(name) VALUES('asd')`)
// )
// .then(res=>{
// 	log(2,res)
// })
// .then(
// 	()=>QUERY(`SELECT * FROM kkk`)
// )
// .then(res=>{
// 	log(3,res)
// })
// .catch(error=>{
// 	log(error)
// })
// 
function getNow() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
};

router.get('/', function(req, res, next) {

	res.cookie('name', 'tobi', { maxAge: 600000 });
	res.clearCookie('name', { path: '/admin' });

	req.session['name']='ioioioioioi';
	req.session.destroy();

	res.render('index', { title: 'Express' });
});

module.exports = router;
