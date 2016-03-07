//The rest
var utility = {
  generateId :  function(){
    return (new Date()).getTime().toString(36);
  },
  renderHtml :  function(htmlObject) {
    var result = '';
    if(Array.isArray(htmlObject)){
      htmlObject.forEach(function(element){
        result+= this.renderHtml(element);
      }.bind(this));
    } else {
      if(htmlObject.tag!=undefined){
        result += '<' + htmlObject.tag;
        result += ' ';
        if(htmlObject.attributes !=undefined){
          htmlObject.attributes.forEach(function(attribute){
            result += attribute.name;
            result += '="';
            result += attribute.value;
            result += '" ';
          });
        }
        result += '>';
        if(htmlObject.text != undefined){
         result += htmlObject.text;
        }
        if(htmlObject.children != undefined){
          result += utility.renderHtml(htmlObject.children);
        }
        result += '</' + htmlObject.tag + '>';
      }
    }
    return result;
  }
};

var html = function(){
  this.structure = {};
};

html.prototype.render = function(){
  utility.renderHtml(this.structure);
};


//ɉQuery patching
$.post =  function( url, data, callback) {
	if ( $.isFunction( data ) ) {
			callback = data;
			data = {};
		}
		return $.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			success: callback,
			contentType:"application/json; charset=utf-8",
		});
};

$.fn.extend({
  insertObject: function(htmlObject){
    //console.log(renderHtml(htmlObject));
    this.html(utility.renderHtml(htmlObject));
  }
});
