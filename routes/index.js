var express = require('express');
var twitter = require('../twitter');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Activity Graph' });

});

/*Uses the twitter library to fetch the tweeets and send them back*/
router.get('/tweets/:user', function(req, res){
	var tweets = twitter.getUserTimeline(req.params.user, req.query.max_id, function(data){
		if(data.length > 0){
			var min_tweet = data[data.length - 1];
			var dates = twitter.parseTweets(data);
			res.json({ 'min_tweet' : min_tweet, 'dates' : dates });
		}
		else{
			res.send({});
		}
	});
});


module.exports = router;
