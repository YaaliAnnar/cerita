var global = {};

var resolveRoute = function(url){
	if(url){
		//console.log('Opening '+url);
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
					setHeight();
					doc.id = hash[2];
					doc.get();
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


 var mouseX = function() {
		 if (window.event.pageX) {
         return window.event.pageX;
     } else if (window.event.clientX) {
        return window.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
     }
 }

var mouseY=function() {
     if (window.event.pageY) {
         return window.event.pageY;
     } else if (window.event.clientY) {
        return window.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
     }
 }

 var hideContextMenu = function(){
	 $('.context-menu').hide();
 }

 var setHeight = function() {
   windowHeight = $(window).innerHeight();
   $('body').css('height', windowHeight);
	 $('#chapter-content').css('height', windowHeight-180);
	 $('#structure').css('height', windowHeight-160);
 };

$(window).on('resize',setHeight);

// var openContextMenu = function(){
// 	var x = window.mouseX();
// 	var y = window.mouseY();
// 	console.log(x,y);
// 	$('#context-menu').addClass('active');
// 	$('#context-menu').offset({ top:y, left:x})
// }
//
// if (document.addEventListener) {
// 		 document.addEventListener('contextmenu', function(e) {
// 				 window.openContextMenu();
// 				 e.preventDefault();
// 		 }, false);
//  } else {
// 		 document.attachEvent('oncontextmenu', function() {
// 				 window.openContextMenu();
// 				 window.event.returnValue = false;
// 		 });
//  }
