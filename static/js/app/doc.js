var doc = {
    id: '',
    title: '',
    structure: [],
    treeStructure: [],
    add: function() {
        this.title = $('#new-title').val();
        this.id = utility.generateId();
        if (this.title.length == 0) {
            alert('Enter doc title');
        } else {
            $.post(
                '/doc/save', this,
                function(response) {
                  this.open();
                }.bind(this)
            );
        }
    },
    save: function(){
      $.post('/doc/save', this, this.get.bind(this));
    },
    open: function() {
        if (!this.id) {
            this.id = $('#save-doc').val();
        }
				if(this.id){
					var url = '#/doc/' + this.id;
					resolveRoute(url);
				}
    },
    get: function() {
        //console.log(this);
        $.post('/doc/get', {
                docId: this.id
            },
            function(response) {
                this.setTitle(response.title);
                this.setStructure(response.structure);
            }.bind(this)
        );
    },
    setTitle:  function(title){
      this.title = title;
      $('#doc-title').html(this.title);
    },
    setStructure:  function(structure){
      this.structure = structure;
      $('#structure').insertObject(docStructure.getHtml());
      $('#structure').scrollTo('#'+chapter.id);
      $('.treeToggle').on('click', docStructure.toggleBranch);
      $('.structure>a').on('contextmenu', function(){
        var id = $(this).parent().attr('id');
        console.log(id);
        window.doc.selectedChapter = id;
        window.showContextMenu('#chapter-context-menu');
        return false;
      });
      if(chapter.id!=''){
        chapter.getTitle();
      }
    },
    reindexStructure: function(parent){
      var children = this.structure.filter(function(child){
        return child.parent == parent;
      });
      children.sort(function(a,b){

        return a.index - b.index;
      });
      //console.log(children);
      children.forEach(function(child,index){
        child.index = index;
      });
      //$('#structure').insertObject(docStructure.getHtml());
    }
};

var docStructure = {
  getHtml : function(parent) {
      var result = [];
      if(!parent){
        parent = 'root';
      }
      var children = doc.structure.filter(function(nodes){
        return nodes.parent == parent;
      });
      children.sort(function(a,b){
        return a.index - b.index;
      });
      children.forEach(function(section) {
          var sectionHtml = {
              tag: 'div',
              attributes: [{
                  name: 'class',
                  value: 'structure' + (section.id==chapter.id?' selected':'')
              }, {
                  name: 'id',
                  value: section.id
              }],
              children: [{
                  tag: 'a',
                  text: '(-)',
                  attributes: [{
                      name: 'class',
                      value: 'treeToggle'
                  }]
              }, {
                  tag: 'a',
                  attributes: [{
                      name: 'onclick',
                      value: "resolveRoute('#/doc/"+ doc.id + "/" + section.id + "')"
                  }],
                  text: section.title
              }]
          };
          var grandChildren = this.getHtml(section.id);
          if(grandChildren.length>0){
            sectionHtml.children = sectionHtml.children.concat(grandChildren);
          }
          if (section.children) {
            sectionHtml.children[0].text = '(o)';
            sectionHtml.children[0].attributes[0].value = 'inert';
          }
          result.push(sectionHtml);
      }.bind(this));
      return result;
  },
  toggleBranch : function() {
      var parentId = $(this).parent().attr('id');
      var parent = $('#' + parentId);
      parent.toggleClass('hidden-children');
      if (parent.hasClass('hidden-children')) {
          $(this).text('(+)');
      } else {
          $(this).text('(-)');
      }
  },
  showMenu : function() {
    $(this).addClass('mouseover');
  },
  hideMenu : function() {
    $(this).removeClass('mouseover');
  }
}
