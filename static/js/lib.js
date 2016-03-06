//The rest
var renderHtml = function(htmlObject) {
  var result = '';
  if(Array.isArray(htmlObject)){
    htmlObject.forEach(function(element){
      result+= renderHtml(element);
    });
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
        result += renderHtml(htmlObject.children);
      }
      result += '</' + htmlObject.tag + '>';
    }
  }
  return result;
}

var html = function(){
  this.structure = {};
};

html.prototype.render = function(){
  renderHtml(this.structure);
};

//Begin app

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
    this.html(renderHtml(htmlObject));
  }
});
