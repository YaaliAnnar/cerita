var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();

//Monkey patching
app.getJson = function(){
   var args = Array.prototype.slice.call(arguments);
   try {
     var file = fs.readFileSync(__dirname+'/' + args.join('/'), 'utf8');
     return JSON.parse(file);
   } catch (e) {
     return null;
   }
};

app.saveJson = function (address,data){
  if(Array.isArray(address)){
    //Find out if folder exists
    var folderAddress = __dirname + '/' + address.slice(0,-1).join('/');
    try {
      fs.accessSync(folderAddress,fs.F_OK);
    } catch (e) {
      fs.mkdir(folderAddress);
    }
    address = __dirname + '/' + address.join('/');
  }
  fs.writeFileSync(address, JSON.stringify(data));
};

app.getText = function(){
   var args = Array.prototype.slice.call(arguments);
   try {
     var file = fs.readFileSync(__dirname+'/' + args.join('/') + '.txt', 'utf8');
     return file;
   } catch (e) {
     return null;
   }
};

app.saveText = function(address, data){
  if(Array.isArray(address)){
    //Find out if folder exists
    var folderAddress = __dirname + '/' + address.slice(0,-1).join('/');
    try {
      fs.accessSync(folderAddress,fs.F_OK);
    } catch (e) {
      fs.mkdir(folderAddress);
    }
    address = __dirname + '/' + address.join('/');
  }
  fs.writeFileSync(address, data, 'utf8');
}

//Creating folders
if(true){
  try {
      fs.accessSync(__dirname + '/docs', fs.F_OK);
  } catch (e) {
      fs.mkdir(__dirname + '/docs');
  }
  try {
      fs.accessSync(__dirname + '/docs.json', fs.F_OK);
  } catch (e) {
      fs.writeFileSync(__dirname + '/docs.json', '[]', 'utf8');
  }
}

//Uses
app.use(bodyParser.json());
app.use('/static', express.static('static'));

//Global controller
app.get('/', function (request, response) {
  response.sendFile(__dirname+'/layout.html');
});

app.get('/page/:page', function (request, response) {
  var page = request.params.page;
  try {
      fs.accessSync(__dirname+'/pages/'+page+'.html', fs.F_OK);
      response.sendFile(__dirname+'/pages/'+page+'.html');
  } catch (e) {
      response.sendFile(__dirname+'/pages/404.html');
  }
});

app.get('/template/:template', function (request, response) {
  var template = request.params.template;
  try {
      fs.accessSync(__dirname+'/templates/'+template+'.html', fs.F_OK);
      response.sendFile(__dirname+'/templates/'+template+'.html');
  } catch (e) {
      response.send('');
  }
});

//Adding specific controllers
fs.readdirSync(__dirname + '/controllers').forEach(function(file) {
    var name = file.substr(0, file.indexOf('.'));
    require('./controllers/' + name)(app);
});

app.listen(8888)
