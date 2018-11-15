var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: ''
});

var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var app = express();

app.set('view engine', 'ejs');

// middlewares
app.use(fileUpload());
app.use(bodyParser.json());

app.get('/',function(req,res) {
  res.render('form',{});
})
app.post('/upload', function(req, res) {
  if (!req.files) {
      res.status(500).end('No files were uploaded.');
  }

  var params = {
    //images_file: fs.createReadStream('./resources/car.png')
    images_file: req.files.images_file.data
  };

  visualRecognition.classify(params, function(err,result) {
    var cr = [];  // classifier result
    if (err) {
      console.log(err);
      res.status(500).end(err);
    }
    else {
      console.log(JSON.stringify(result, null, 2));
      for (var i in result.images) {
        for (var j in result.images[i].classifiers) {
          for (var k in result.images[i].classifiers[j].classes){
            cr.push(result.images[i].classifiers[j].classes[k]);
          }
        }
      }
    }
    var photo = new Buffer(req.files.images_file.data).toString('base64');
    var mimetype = req.files.images_file.mimetype;
    res.render('result',{results:cr,photo:photo,mimetype:mimetype});
  });
});

app.listen(process.env.PORT || 8099, function() {
    console.log('Server running...');
});
