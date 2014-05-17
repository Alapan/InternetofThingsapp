var express=require('express');
var router=express.Router();
var fs=require('fs');

router.get('/',function(req,res){
//	fs.readFile('file.txt','utf8',function(err,data){
//		if(err){
//			throw err;
//		}
//		var temperature=[];
//		dat.split(/\n/).forEach(function(item){
//			temperature.push(Number(item.match(/Temperature(.\d+[.]\d+)/)[1]));
//		});
//	});
	res.send('<p> Temperature array read');
});

module.exports=router;
