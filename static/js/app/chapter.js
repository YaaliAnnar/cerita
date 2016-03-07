var chapter = {
    index: 0,
    id: '',
    title: '',
    text: '',
    mode: '',
    paragraphs: [],
    setText: function (text){
      this.text = text;
      this.paragraphs = text.split(/[\r\n]+/);
      var paragraphHtml = [];
      this.paragraphs.forEach(function(paragraph,index){
        paragraphHtml.push({
          tag: 'p',
          attributes: [
            {
              name: 'class',
              value: 'paragraph ' + index
            }
          ],
          text: paragraph
        });
      });
      $('#chapter-content').insertObject(paragraphHtml);
    },
    setTitle : function (title){
      this.title = title;
    },
    edit: function() {
        var edit = $('#chapter-edit');
        var view = $('#chapter-view');

        if (edit.is(':visible')) {
          $.post(
              '/edit_chapter', {
                  docId: doc.id,
                  chapterId: this.id,
                  chapterText:  $('#chapter-text').val(),
                  chapterTitle: $('#chapter-title-input').val()
              },
              function(response) {
                  doc.getStructure();
                  this.setText($('#chapter-text').val());
                  this.setTitle($('#chapter-title-input').val());
              }.bind(this)
          );
        } else {
          $('#chapter-text').val(this.text);
          $('#chapter-title-input').val(this.title);
          view.hide();
          edit.show();
        }
    },
    getTitle: function(){
      var searchThrough = function(tree, id){
        var leaf = '';
        tree.forEach(function(branch){
          //console.log(id,branch.id);
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
      var chapter = searchThrough(doc.structure,this.id);
      this.title = chapter.title;
      $('#chapter-title').text(this.title);
    },
    add: function() {
        var form = $('#chapter-form');
        var chapter = $('#chapter');
        if (form.is(":visible")) {
            this.id     = utility.generateId();
            this.title  = $('#new-chapter-title').val();
            this.parent = $('#new-chapter-parent').val();
            this.index  = $('#new-chapter-index').val()*1;
            this.docId  = doc.id;
            if (this.title.length == 0) {
                alert('Enter Chapter Title');
            } else {
                doc.structure.push(this);
                doc.reindexStructure(this.parent);
                console.log(doc.structure);
                doc.save();
                $.post('/chapter/save',this,function(response){
                  form.modal('hide');
                  resolveRoute('#/doc/'+doc.id+'/'+this.id);
                }.bind(this));
            }
        } else {
            chapterForm.getParents();
            chapterForm.getIndexes();
            chapter.hide();
            form.modal();
        }
    },
    open: function(id) {
      $.post(
          '/chapter/get', {
              docId: doc.id,
              id: this.id
          },
          function(response) {
              $('#chapter').show();
              this.setText(response);
              if(this.mode == 'edit'){
                this.edit();
              }
          }.bind(this)
      );
      if(doc.structure.length>0){
        this.getTitle();
      }
    }
};
