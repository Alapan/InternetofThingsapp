var express=require('express');
var router=express.Router();
var fs=require('fs');

router.get('/',function(req,res){
//	fs.readFile('file.txt','utf8',function(err,data){
//		if(err){
//			throw err;
//		}
//		var humidity=[];
//		dat.split(/\n/).forEach(function(item){
//			humidity.push(Number(item.match(/Humidity(.\d+[.]\d+)/)[1]));
//		});
//	});
	res.send('<p> Humidity array read');
});

module.exports=router;
