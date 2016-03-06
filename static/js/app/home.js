var home = {};

home.getdocList = function(){
	$.post(
		'/doc_list',
		function(response){
				var options = [];
				response.forEach(function(doc){
						options.push({
							tag: 'option',
							text: doc.name,
							attributes: [
								{name: 'value', value : doc.id}
							],
							text: doc.name
						});
				});
				$('#saved-name').insertObject(options);
		}
	);
};
