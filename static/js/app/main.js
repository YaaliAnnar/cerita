var global = {};

var resolveRoute = function(url){
	if(url){
		console.log('Opening '+url);
		window.history.pushState('', 'Writer', url);
	}
	var hash = window.location.hash;
  var mainContainer = $('#main-container');
	if (hash == ''){
		mainContainer.load('/page/home',function(){
			home.getdocList();
		});
	} else {
		hash = hash.split('/');
		switch(hash[1]){
			case 'doc':
				mainContainer.load('/page/doc',function(){
					doc.id = hash[2];
					doc.getTitle();
					doc.getStructure();
					if(hash[3]){
						chapter.id = hash[3];
						chapter.open();
					}
				});
				break;
			default:
				mainContainer.load('/page/404');
		}
	}
}
