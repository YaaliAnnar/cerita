module.exports = function(app){
  app.post('/doc/list', function(request, response){
      var docList  = app.getJson('docs.json');
      response.send(docList);
  });

  app.post('/doc/save', function (request, response) {
    var inputDoc = request.body;
    var docList  = app.getJson('docs.json');
    // Document Structure
    if(true){
      if(inputDoc.structure){
        //Nullify paragraph and structure
        delete inputDoc.structure.paragraph;
        delete inputDoc.structure.text;
        app.saveJson(['docs',inputDoc.id,'structure.json'],inputDoc.structure);
      } else {
        app.saveJson(['docs',inputDoc.id,'structure.json'],[]);
      }
    }
    //Nullify structure
    delete inputDoc.structure;
    if(true){
      var newDoc = true;
      docList.forEach(function(doc,index){
        if(doc.id==inputDoc.id){
          newDoc = false;
          docList[index] = inputDoc;
        }
      });
      if(newDoc){
        docList.push(inputDoc);
      }
      app.saveJson('docs.json', docList);
    }
    response.send('success');
  });

  app.post('/doc/get', function(request, response){
    var result = {};
    var postData = request.body;
    var docId = postData.docId;
    //Title
    if(true){
      var docList  = app.getJson('docs.json');
      //console.log(docList);
      var selectedDoc = docList.filter(function(doc){
        return doc.id == docId;
      });
      if(selectedDoc.length>0){
        result = selectedDoc[0];
      }
    }
    //Structure
    if(true){
      var documentStructure = app.getJson('docs',docId,'structure.json');
      if(documentStructure==null){
        documentStructure = [];
        app.saveJson(['docs',docId,'structure.json'],documentStructure);
      }
      result.structure = documentStructure;
    }
    response.send(result);
  });
}
