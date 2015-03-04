var express = require('express');
var twitter = require('../twitter');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Activity Graph' });

});

router.get('/tweets/:user', function(req, res){
	var tweets = twitter.getUserTimeline(req.params.user, req.query.max_id, function(data){
		res.send(data);
	});
})


module.exports = router;
