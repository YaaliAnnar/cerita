var doc = {
    id: '',
    title: '',
    structure: [],
    add: function() {
        this.title = $('#new-title').val();
        if (this.title.length == 0) {
            alert('Enter doc title');
        } else {
            $.post(
                '/create_doc', {
                    title: this.title
                },
                function(response) {
                    if (response.status == 'error') {
                        alert(response.error);
                    } else {
                        this.id = response.docId;
                        this.open();
                    }
                }.bind(this)
            );
        }
    },
    open: function() {
        if (!this.id) {
            this.id = $('#saved-title').val();
        }
				if(this.id){
					var url = '#/doc/' + this.id;
					resolveRoute(url);
				}
    },
    getTitle: function() {
        $.post('/doc_title', {
                docId: this.id
            },
            function(response) {
                this.title = response;
                $('#doc-title').html(response);
            }.bind(this)
        );
    },
    getStructure: function() {
        $.post(
            '/doc_structure', {
                docId: this.id
            },
            function(response) {
                this.structure = response;
                $('#structure').insertObject(getDocStructureHtml(this.structure));
                $('.treeToggle').on('click', docStructureToggle);
                if(chapter.id!=''){
                  chapter.getTitle();
                }
            }.bind(this)
        );
    },
};

var getDocStructureHtml = function(source) {
    var result = [];
    source.forEach(function(section) {
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
        if (section.children) {
					  sectionHtml.children = sectionHtml.children.concat(getDocStructureHtml(section.children));
        } else {
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
    renderFlatChapterList: function(structure, parentIndex) {
        var result = [];
        if (!parentIndex) {
            result.push([{
                tag: 'option',
                attributes: [{
                    name: 'value',
                    value: 'root'
                }],
                text: 'Document Root'
            }]);
            parentIndex = '';
        } else {
            parentIndex += '.';
        }
        structure.forEach(function(chapter, index) {
            result.push({
                tag: 'option',
                text: parentIndex + index + ' ' + chapter.title,
                attributes: [{
                    name: 'value',
                    value: parentIndex + index
                }]
            });
            if (chapter.children) {
                result = result.concat(chapterForm.renderFlatChapterList(chapter.children, parentIndex + index));
            }
        });
        return result;
    },
    renderSelectedChildren: function() {
        var address = $('#new-chapter-destination').val();
        var selectedChapter = doc.structure;
        if (address != 'root') {
            //console.log(address.split('.'));
            address.split('.').forEach(function(nextDestination) {
                selectedChapter = selectedChapter[nextDestination];
                if (!selectedChapter.children) {
                    selectedChapter.children = [];
                }
                selectedChapter = selectedChapter.children;
            });
        }
        var options = [{
            tag: 'option',
            attributes: [{
                name: 'value',
                value: 0
            }],
            text: 'At the begining'
        }];
        selectedChapter.forEach(function(chapter, index) {
            options.push([{
                tag: 'option',
                attributes: [{
                    name: 'value',
                    value: index + 1
                }],
                text: 'After "' + chapter.title + '"'
            }]);
        });
        $('#new-chapter-position').insertObject(options);
    }
};
