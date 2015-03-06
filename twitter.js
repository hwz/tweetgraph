var OAuth2 = require('oauth').OAuth2;
var https = require('https');
var config = require('./config');

var twitter = {};

var consumerKey = process.env.CONSUMER_KEY || config.consumerKey;
var consumerSecret = process.env.CONSUMER_SECRET || config.consumerSecret;
var accessToken;    //to be populated by oauth initialization 

var oauth2 = new OAuth2(consumerKey, consumerSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    if(e){
        console.log(e);
    }
    else{
        accessToken = access_token;
    }
});

twitter.getUserTimeline = function(user, max_id, callback){
    var url = '/1.1/statuses/user_timeline.json?trim_user=1&count=200&screen_name='+user;
    if(max_id !== undefined){
        url += '&max_id=' + max_id;
    }
    
    var options = {
        hostname: 'api.twitter.com',
        path: url,
        headers: {
            Authorization: 'Bearer ' + accessToken
        }                       
    };

    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
            callback(tweets);

        });
    });
};

module.exports = twitter;
