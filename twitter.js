var oauth2 = require('oauth').OAuth2;
var config = require('./config');

var consumerKey = process.env.CONSUMER_KEY || config.consumerKey;
var consumerSecret = process.env.CONSUMER_SECRET || config.consumerSecret;
var accessToken = process.env.ACCESS_TOKEN || config.accessToken;
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || config.accessTokenSecret;

oauth = new oauth2(consumerKey,
    ConsumerSecret, 
    'https://api.twitter.com/', 
    null,
    'oauth2/token', 
    null
);

twitter.getTweets(user, callback){
    oauth.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name="+user, access_token, access_token_secret, function(error, data){
        if(error){
            console.log("error");
            callback([]);
        }
        else{
            callback(data);
        }
    });
}

twitter = module.exports;

