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
          children.sort(function(a,b){
            return a.index - b.index;
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
                  value: index + 0.1
              }],
              text: subNode.title
          });
        });
        $('#new-chapter-index').insertObject(options);
    }
};
