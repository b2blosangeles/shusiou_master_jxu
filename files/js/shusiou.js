function setVideo(vid, s, l) {
	var url = '/api/video/play_video_section.api?vid=' + vid
	var r = '<video width="640" height="480" controls autoplay>' +
		 ' <source src="'+url+'&s='+s+'&l='+l+'" type="video/mp4">' +
		'  <source src="movie.ogg" type="video/ogg">' +
	'	Your browser does not support the video tag.' +
		'</video>';
  	document.getElementById('niu').innerHTML = r;
	var img = ''
	for (var i = 0; i < 1000; i+=50) {
		img += '<img src="/api/video/video_image.api?vid='+vid+'&s='+i+'" width="90"/>'
	}
	document.getElementById('img').innerHTML = img;
}

setTimeout(
	function() {
 		setVideo(1, 10, 6);
 }, 1000
)
