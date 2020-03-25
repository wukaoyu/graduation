var express = require('express');
var co = require('co');  
var OSS = require('ali-oss');
const { SuccessModel, ErrorModel } = require("../model/resModel");
// 上传图片到阿里云oss使用
var fs = require('fs');

var router = express.Router();

var client = new OSS({
  region: 'oss-cn-beijing',//填写你开通的oss
  accessKeyId: 'LTAI4FkTBVrWgTCvd59Zoju3',
  accessKeySecret: 'e35pFXCKpepX4YYyp8hC6GFFqrWN8m'
});

var ali_oss = {
    bucket: 'wkydegraduation',  //阿里云您的bucket
    endPoint: 'oss-cn-beijing.aliyuncs.com', //填写你开通的oss地址
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/imgUpload', function(req, res, next){
  // 图片数据流
  var imgData = req.body.imgfiles;
  // 构建图片名
  var fileName = Date.now() + '.png';
  // 构建图片路径
  var filePath = './tmp/' + fileName;
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer.from(base64Data, 'base64');
  fs.writeFile(filePath, dataBuffer, function(err) {
    if(err){
      
      res.end(JSON.stringify({status:102,msg:'文件写入失败'}));
    }else{
      var localFile = filePath;
      var key = fileName;
      // 阿里云 上传文件
      co(function* () {
        client.useBucket(ali_oss.bucket);
        var result = yield client.put(key, filePath);
        var imageSrc = 'http://wkydegraduation.oss-cn-beijing.aliyuncs.com/' + result.name;
          //上传之后删除本地文件         
        fs.unlinkSync(filePath); 
        res.end(JSON.stringify({status:100,msg:'上传成功',imageUrl:imageSrc}));
      }).catch(function (err) {
        console.log(err)
        res.end(JSON.stringify({status:101,msg:'上传失败',error:JSON.stringify(err)}));
      });
    }
  });
});

module.exports = router;
