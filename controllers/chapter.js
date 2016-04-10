module.exports = function(app){
  app.post('/chapter/get', function(request,response){
    var inputChapter = request.body;
    response.send(app.getText('docs', inputChapter.docId, inputChapter.id));
  });

  app.post('/chapter/save', function(request,response){
    var inputChapter = request.body;
    delete inputChapter.paragraphs;
    delete inputChapter.mode;
    if(!inputChapter.text){
      inputChapter.text = '';
    }
    //console.log(inputChapter);
    app.saveText(['docs',inputChapter.docId,inputChapter.id+'.txt'],inputChapter.text);
    response.send('success');
  });
}
