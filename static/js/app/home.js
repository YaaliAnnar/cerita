var home = {};

home.getdocList = function(){
	$.post(
		'/doc/list',
		function(response){
				var options = [];
				response.forEach(function(doc){
						options.push({
							tag: 'option',
							text: doc.title,
							attributes: [
								{name: 'value', value : doc.id}
							],
							text: doc.title
						});
				});
				$('#save-doc').insertObject(options);
		}
	);
};
