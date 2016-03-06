var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
var app = express();


//Creating folders
try {
    fs.accessSync('docs', fs.F_OK);
} catch (e) {
    fs.mkdir('docs');
}

try {
    fs.accessSync('docs.json', fs.F_OK);
} catch (e) {
    fs.writeFileSync('docs.json', '[]', 'utf8');
}

var global = {};
global.docs = JSON.parse(fs.readFileSync('docs.json', 'utf8'));

var getViewPath = function(view){
  return __dirname + '/views/'+view+'.html'
};

//Uses
app.use(bodyParser.json());
app.use('/static', express.static('static'));

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

app.post('/doc_list', function(request, response){
    response.sendFile(__dirname + '/docs.json');
});

app.post('/create_doc', function (request, response) {
	var docId =  (new Date()).getTime().toString(36);
  var postData = request.body;
	var result = {};
	global.docs.push({id:docId, title: postData.title});
	fs.writeFile('docs.json', JSON.stringify(global.docs), function(error){
	  if (error) {
			result.status = 'error';
			result.error = error;
			response.send(result);
		} else {
			fs.mkdir('docs/'+docId);
			result.status = 'success';
			result.docId = docId;
			response.send(result);
		}
	});
});

app.post('/doc_title', function(request, response){
  var postData = request.body;
  var docId = postData.docId;
  var selecteddoc = global.docs.filter(function(doc) {
    return doc.id == docId;
  });
  response.send(selecteddoc[0].title);
});

app.post('/doc_structure', function(request, response){
  var postData = request.body;
  var docId = postData.docId;
  try {
      fs.accessSync(__dirname+'/docs/'+docId +'/structure.json', fs.F_OK);
  } catch (e) {
      fs.writeFileSync(__dirname+'/docs/'+docId +'/structure.json', '[]', 'utf8');
  }
  response.sendFile(__dirname+'/docs/'+docId +'/structure.json');
});

app.post('/add_chapter', function(request,response){
  var postData = request.body;
  var docId = postData.docId;
  var docStructure = JSON.parse(fs.readFileSync(__dirname+'/docs/'+docId +'/structure.json', 'utf8'));
  //
  var chapterId =  (new Date()).getTime().toString(36);
  fs.writeFileSync(__dirname+'/docs/'+docId +'/' + chapterId + '.txt', '', 'utf8');
  var selectedChapter = docStructure;
  if(postData.destination!='root'){
    postData.destination.split('.').forEach(function(nextDestination){
			selectedChapter=selectedChapter[nextDestination];
      if(selectedChapter.children==undefined){
        selectedChapter.children = [];
      }
      selectedChapter = selectedChapter.children;
		});
  }
  selectedChapter.splice(postData.position,0,{
    title: postData.title,
    id: chapterId
  })
  console.log(docStructure);
  fs.writeFileSync(__dirname+'/docs/'+docId +'/structure.json', JSON.stringify(docStructure), 'utf8');
  response.send(chapterId);
});

app.post('/open_chapter', function(request,response){
  var postData = request.body;
  response.sendfile(__dirname+'/docs/'+postData.docId +'/' + postData.chapterId + '.txt');
});

app.post('/edit_chapter', function(request,response){
  var postData = request.body;
  //Find the chapter
  var searchThrough = function(tree, id){
    var leaf = '';
    tree.forEach(function(branch){
      if(leaf==''){
        if(id==branch.id){
          leaf = branch;
        }
        if(branch.children){
          var searchResult = searchThrough(branch.children,id);
          if(searchResult!=''){
            leaf = searchResult;
          }
        }
      }
    });
    return leaf;
  };
  //Get Document Structure
  var docStructure = JSON.parse(fs.readFileSync(__dirname+'/docs/'+postData.docId +'/structure.json', 'utf8'));
  var chapter = searchThrough(docStructure,postData.chapterId);
  if(chapter.title!=postData.chapterTitle){
    chapter.title=postData.chapterTitle;
  }
  fs.writeFileSync(__dirname+'/docs/'+postData.docId +'/structure.json', JSON.stringify(docStructure), 'utf8');
  fs.writeFileSync(__dirname+'/docs/'+postData.docId +'/'+postData.chapterId + '.txt', postData.chapterText, 'utf8');
  response.send('Done');
});

app.listen(8888)
