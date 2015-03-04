var oauth2 = require('oauth').OAuth2;
var config = require('./config');

var twitter = {};

var consumerKey = process.env.CONSUMER_KEY || config.consumerKey;
var consumerSecret = process.env.CONSUMER_SECRET || config.consumerSecret;
var accessToken = process.env.ACCESS_TOKEN || config.accessToken;
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || config.accessTokenSecret;

oauth = new oauth2(consumerKey,
    consumerSecret, 
    'https://api.twitter.com/', 
    null,
    'oauth2/token', 
    null
);

twitter.getUserTimeline = function(user, callback){
    console.log("access token: "+accessToken);
    oauth.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name="+user, accessToken, accessTokenSecret, function(e, data){
        if(e){
            console.log("error");
            callback([]);
        }
        else{
            callback(data);
        }
    });
}

module.exports = twitter;

