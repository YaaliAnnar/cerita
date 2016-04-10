var chapter = {
    index: 0,
    id: '',
    title: '',
    text: '',
    mode: '',
    docId: '',
    paragraphs: [],
		wordCount: 0,
		updateWordCount: function(){
			this.wordCount = this.text.split(/ /).length;
			$('#word-count').text(this.wordCount);
		},
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
      $('.paragraph').on('contextmenu', function(){
        var id = $(this).attr('class');
        paragraph.id = id.split(' ')[1];
        window.showContextMenu('#paragraph-context-menu');
        return false;
      });
    },
    setTitle : function (title){
      this.title = title;
    },
    edit: function() {
        this.docId  = doc.id;
        var edit = $('#chapter-edit');
        var view = $('#chapter-view');
        if (edit.is(':visible')) {

          this.text = $('#chapter-text').val();
          this.title = $('#chapter-title-input').val();

          doc.structure.forEach(function(member,index){
            if(member.id == this.id){
              doc.structure[index].title = this.title;
            }
          }.bind(this));
          doc.save();
          this.save();
          //
          view.show();
          edit.hide();
        } else {
          $('#chapter-text').val(this.text);
          $('#chapter-title-input').val(this.title);
          view.hide();
          edit.show();
        }
    },
    save: function (){
      this.docId  = doc.id;
      $.post(
          '/chapter/save', this,
          function(response) {
              this.mode = 'view';
              this.open(this.id);
          }.bind(this)
      );
    },
    getTitle: function(){
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
      var chapter = searchThrough(doc.structure,this.id);
      this.title = chapter.title;
      $('#chapter-title').text(this.title);
    },
    addChildren: function(){
      this.add();
      $('#new-chapter-parent').val(doc.selectedChapter);
      chapterForm.getIndexes();
    },
    add: function() {
        var form = $('#chapter-form');
        var chapter = $('#chapter');
        if (form.is(":visible")) {
            this.id     = utility.generateId();
            this.title  = $('#new-chapter-title').val();
            this.parent = $('#new-chapter-parent').val();
            this.index  = $('#new-chapter-index').val()*1;
            this.text   = '';
            this.docId  = doc.id;
            if (this.title.length == 0) {
                alert('Enter Chapter Title');
            } else {

                doc.structure.push(this);
                doc.reindexStructure(this.parent);
                doc.save();
                $.post('/chapter/save',this,function(response){

                  $('#chapter-form').modal('hide');
                  $('.modal-backdrop').remove();
                  this.mode = 'edit';
                  resolveRoute('#/doc/'+doc.id+'/'+this.id);
                }.bind(this));
            }
        } else {
            $('.chapter-btn').hide();
            $('#chapter-add-button').show();
            chapterForm.getParents();
            chapterForm.getIndexes();
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
                this.mode == 'view';
              }
							this.updateWordCount();
          }.bind(this)
      );
      if(doc.structure.length>0){
        this.getTitle();
      }
    },
    delete: function(){
        var id = doc.selectedChapter;
        var deletedIndex;
        doc.structure.forEach(function(section,index){
            if(section.id == id){
              deletedIndex = index;
            }
        });
        if(deletedIndex){
          var parentId = doc.structure[deletedIndex].parent;
          doc.structure.splice(deletedIndex,1);
          doc.reindexStructure(parentId);
          doc.save();
        }
    },
    move: function(){
      var id = doc.selectedChapter;
      //console.log(id);
      if(id){
        this.id = id
      }
      var selectedChapter = doc.structure.filter(function(member){
        return member.id == this.id;
      }.bind(this));
      //console.log(selectedChapter)
      //var chapterForm = $('#chapter-form');
      var selectedChapter = selectedChapter[0];
      var form = $('#chapter-form');
      if (form.is(":visible")) {
          selectedChapter.parent = $('#new-chapter-parent').val();
          selectedChapter.index  = $('#new-chapter-index').val()*1;
          doc.reindexStructure(selectedChapter.parent);
          doc.save();

          this.open();

          $('#chapter-form').modal('hide');
          $('.modal-backdrop').remove();

      } else {
          $('.chapter-btn').hide();
          $('#new-chapter-title').val(selectedChapter.title);
          $('#chapter-move-button').show();

          chapterForm.getParents();
          chapterForm.getIndexes();
          form.modal();
      }
    }
};
