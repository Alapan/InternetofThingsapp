var express=require('express');
var router=express.Router();
var fs=require('fs');

router.get('/',function(req,res){
//	fs.readFile('file.txt','utf8',function(err,data){
//		if(err){
//			throw err;
//		}
//		var luminosity=[];
//		dat.split(/\n/).forEach(function(item){
//			luminosity.push(Number(item.match(/Light(.\d+[.]\d+)/)[1]));
//		});
//	});
	res.send('<p> Luminosity array read');
});

module.exports=router;
