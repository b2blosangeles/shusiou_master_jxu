function setVideo(vid, s, l) {
	var url = '/api/video/play_video_section.api?vid=' + vid
	var r = '<video width="640" height="480" controls autoplay>' +
		 ' <source src="'+url+'&s='+s+'&l='+l+'" type="video/mp4">' +
		'  <source src="movie.ogg" type="video/ogg">' +
	'	Your browser does not support the video tag.' +
		'</video>';
  	// document.getElementById('niu').innerHTML = r;
	var img = ''
	for (var i = 1; i < 100; i+=2) {
		// if (i == 10) continue;
		img += '<img src="/api/video/shusiou_video_image.api?vid=P6&s='+i+'&w=180&_'+new Date().getTime()+'" width="90" '+
			' onClick="setVideo('+vid+', '+i+', 180)"' +
			'/>'
	}
	document.getElementById('img').innerHTML = img;
}

setTimeout(
	function() {
 		setVideo(1, 10, 6);
 }, 1000
)
