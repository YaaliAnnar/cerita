var paragraph = {
  id: 0,
  text: '',
	delete: function(){
		chapter.paragraphs[this.id] = '';
		chapter.text = chapter.paragraphs.join('\r\n');
		chapter.save();
	},
  edit: function(option){
    var paragraphFormTemplate = $('#paragraph-form-template');
    if(paragraphFormTemplate.length==0){
      $.get('/template/paragraphForm',function(data){
        //console.log(data);
        $(data).appendTo('body');
        this.edit();
      }.bind(this));
    } else if (option =='cancel'){
      $('.paragraph-form').hide();
      $('.paragraph').show();
    } else {
      var id = this.id;
      var paragraphForm = $('.paragraph-form.'+id);
      var paragraph = $('.paragraph.'+id);
      if(paragraphForm.length==0){
        paragraphForm = $('#paragraph-form-template').clone();
        paragraphForm.removeAttr("id");
        paragraphForm.addClass(id);
        paragraphForm.find('.paragraph-text').addClass(id);
        paragraphForm.insertAfter(paragraph);
      }
      if(paragraphForm.is(':visible')){
        this.text = $('.paragraph-text.'+id).val();
        //Chapter sheenanigans
        chapter.paragraphs[id] = this.text;
        chapter.text = chapter.paragraphs.join('\r\n');
        chapter.save();
      } else {
        this.text = chapter.paragraphs[id];
        $('.paragraph-text.'+id).val(this.text);
        paragraphForm.show();
        paragraph.hide();
      }
      //console.log(this.id);
    }
  }
};
