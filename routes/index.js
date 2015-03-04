var express = require('express');
var twitter = require('../twitter');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Activity Graph' });

});

router.get('/tweets', function(req, res){
	var tweets = twitter.getUserTimeline(req.params.user, function(data){
		console.log(data);
	});
})


module.exports = router;
