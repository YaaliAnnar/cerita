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
                //console.log(response);
                //console.log(this);
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
      $('#structure').insertObject(getDocStructureHtml());
      $('.treeToggle').on('click', docStructureToggle);
      if(chapter.id!=''){
        chapter.getTitle();
      }
    },
    reindexStructure: function(parent){
      var children = this.structure.filter(function(child){
        return child.parent == parent;
      });
      children.sort(function(a,b){
        a.index - b.index;
      });
      children.forEach(function(child,index){
        child.index = index;
      });
    }
};


var getDocStructureHtml = function(parent) {
    var result = [];
    if(!parent){
      parent = 'root';
    }
    var children = doc.structure.filter(function(nodes){
      return nodes.parent == parent;
    });
    children.sort(function(a,b){
      a.index - b.index;
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
        var grandChildren = getDocStructureHtml(section.id);
        if(grandChildren.length>0){
          sectionHtml.children = sectionHtml.children.concat(grandChildren);
        }
        if (section.children) {
          sectionHtml.children[0].text = '(o)';
          sectionHtml.children[0].attributes[0].value = 'inert';
        }
        result.push(sectionHtml);
    });
    return result;
};

docStructureToggle = function() {
    var parentId = $(this).parent().attr('id');
    var parent = $('#' + parentId);
    parent.toggleClass('hidden-children');
    if (parent.hasClass('hidden-children')) {
        $(this).text('(+)');
    } else {
        $(this).text('(-)');
    }
};

var chapterForm = {
    getParents: function(parent, depth) {
        var subFunction = function(parent, depth){
          var options = [];
          if (!parent) {
              options.push({
                tag: 'option',
                text: 'Document Root',
                attributes: [{
                  name: 'value',
                  value: 'root'
                }]
              });
              parent = 'root';
          }
          if (!depth) {
              depth = 1;
          }
          var prefix = (new Array(depth)).join('-');
          var children = doc.structure.filter(function(subNode){
            return subNode.parent == parent;
          });
          children.forEach(function(subNode){
            options.push({
                tag: 'option',
                text: prefix + subNode.title,
                attributes: [{
                  name: 'value',
                  value: subNode.id
                }]
            });
            var grandChildren = subFunction(subNode.id,depth+1);
            if(grandChildren.length>0){
              options = options.concat(grandChildren);
            }
          }.bind(this));
          return options;
        }

        var options = subFunction(parent,depth);
        $('#new-chapter-parent').insertObject(options);
    },
    getIndexes: function() {
        var options = [{
            tag: 'option',
            attributes: [{
                name: 'value',
                value: -1
            }],
            text: 'At the begining'
        }];
        var parent = $('#new-chapter-parent').val();
        var children = doc.structure.filter(function(subNode){
          return subNode.parent == parent;
        });
        children.sort(function(a,b){
          return a.index - b.index;
        });
        children.forEach(function(subNode, index){
          options.push({
              tag: 'option',
              attributes: [{
                  name: 'value',
                  value: index - 0.1
              }],
              text: subNode.title
          });
        });
        $('#new-chapter-index').insertObject(options);
    }
};
