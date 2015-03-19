function callback(e) {
    var e = window.e || e;
    if(!e.target.name){
    	return;
    } else {
    	data = "The test subject just clicked "+e.target.name+" the time is: "+new Date().getTime() / 1000;
   		$.ajax({
  			type: "POST",
  			url: "https://fypserver-jamesgallagher.c9.io/api",
  			data: data,
		});
    }
}

if (document.addEventListener){
    document.addEventListener('click', callback, false);
}else{
    document.attachEvent('onclick', callback);
}