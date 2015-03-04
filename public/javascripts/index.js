$(function(){
	$('#generate').click(function(){
		generate();
	});

	var generate = function(){
		var cal = new CalHeatMap();
		cal.init({itemSelector: '#tweet-heatmap'});
	};

});



