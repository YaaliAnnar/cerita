module.exports = function(app){
  app.post('/chapter/get', function(request,response){
    var inputChapter = request.body;
    response.send(app.getText('docs', inputChapter.docId, inputChapter.id));
  });

  app.post('/chapter/save', function(request,response){
    var inputChapter = request.body;
    app.saveText(['docs',inputChapter.docId,inputChapter.id+'.txt']);
    response.send('success');
  });
}
