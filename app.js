// Imports
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const spawn = require("child_process").spawn;
const redis = require("redis");
var bodyParser = require("body-parser");
const client = redis.createClient();

// Handle err
client.on("error", function (error) {
  console.error(error);
});

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
}).single('inputVideo');

// Create server
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Upload video
app.post('/upload/video', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ 'success': false, 'msg': err });
    } else {
      if (req.file == undefined) {
        console.log('No File Selected!');
        res.status(400).json({ 'success': false, 'msg': 'No File Selected!' });
      } else {
        const sessionId = new Date().getTime();
        console.log(`File uploaded. Processing video... Please recheck on session id after few minutes! SESSION ID: ${sessionId}`);
        res.status(200).json({ 'success': true, 'msg': 'File uploaded. Processing video... Please recheck on session id after few minutes', content: sessionId });
        const pythonProcess = spawn('python3', ["random_script.py", sessionId, `public/uploads/${req.file.filename}`]);
        pythonProcess.stdout.on('data', (data) => {
          console.log(data.toString());
        });
      }
    }
  });
});

// Get result
app.post('/calculate/bpm', (req, res) => {
  client.get(req.body.sessionId, function (err, reply) {
    if (!reply) {
      console.log('Still processing. Please wait!');
      res.status(400).json({ 'success': false, 'msg': 'Processing... Please wait' });
    } else {
      console.log(`Result calculated: ${reply.substring(8, reply.length - 3)}`);
      res.status(200).json({ 'success': true, 'msg': 'Result processed', content: reply.substring(8, reply.length - 3) });
    }
  });
});

const port = 80;

app.listen(port, () => console.log(`Server started on port ${port}`));

