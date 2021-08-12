var express = require('express');
var router = express.Router();
const multer = require('multer');
var fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '' + '.png')
  }
})

const upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    fs.readFile('Data/data.json', (err, existingData) => {
      if (err) {
        res.send({
          "status": false,
          "message": err
        })
      } else {
        var data = {
          title: req.body.title,
          description: req.body.description,
          url: req.file.filename
        }
        if (existingData.length > 0) {
          var parsedData = JSON.parse(existingData);
          parsedData.push(data);
          fs.writeFile('Data/data.json', JSON.stringify(parsedData), (err) => {
            if (err) {
              res.send({
                "status": false,
                "message": err
              })
            } else {
              res.send({
                "status": true,
                "message": "Successfully uploaded photo"
              })
            }
          });
        } else {
          var data = [{
            title: req.body.title,
            description: req.body.description,
            url: req.file.filename
          }];
          fs.writeFile('Data/data.json', JSON.stringify(data), (err) => {
            if (err) {
              res.send({
                "status": false,
                "message": err
              })
            } else {
              res.send({
                "status": true,
                "message": "Successfully uploaded photo"
              })
            }
          });
        }
      }
    });
  } catch (err) {
    res.send({
      "status": false,
      "message": err
    })
  }
});

router.get("/getPhotos", (req, res) => {
  try {
    fs.readFile('Data/data.json', (err, data) => {
      if (err) {
        res.send({
          "status": false,
          "message": err
        })
      } else {
        res.send({
          "status": true,
          "message": JSON.parse(data)
        })
      }
    })
  } catch (err) {
    res.send({
      "status": false,
      "message": err
    })
  }
})


module.exports = router;
