var chapter = {
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
        var form = $('#add-chapter-form');
        var chapter = $('#chapter');
        if (form.is(":visible")) {
            var title = $('#new-chapter-title').val();
            if (title.length == 0) {
                alert('Enter Chapter Title');
            } else {
                $.post(
                    '/add_chapter', {
                        docId: doc.id,
                        title: $('#new-chapter-title').val(),
                        destination: $('#new-chapter-destination').val(),
                        position: $('#new-chapter-position').val()
                    },
                    function(response) {
                        doc.selectedChapter = response;
                        doc.getStructure();
                        this.mode = 'edit';
                        form.hide();
                        resolveRoute('#/doc/'+doc.id+'/'+this.id);
                    }.bind(this)
                );
            }
        } else {
            var flatChapterList = chapterForm.renderFlatChapterList(doc.structure);
            $('#new-chapter-destination').insertObject(flatChapterList);
            chapterForm.renderSelectedChildren();
            chapter.hide();
            form.show();
        }
    },
    open: function(id) {
      $.post(
          '/open_chapter', {
              docId: doc.id,
              chapterId: this.id
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
