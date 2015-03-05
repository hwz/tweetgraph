$(function(){
    $('#generate').click(function(){
        var username = $('#username').val();
        generate(username, undefined, render);
    });

    var generate = function(username, max_id, callback){
        var url = '/tweets/'+username;
        if(max_id !== undefined){
            url = url+'?max_id=' + max_id;
        }
        $.get(url, function(data){
            console.log(url);
            callback(data);
        });

    };
    var parseTweets = function(tweets){
        var num=0;
        var dates = {};
        if (tweets.length > 0) {
            $.each(tweets, function(count, tweet){
                var date = (new Date(tweet.created_at)).getTime();
                date = (date/1000).toString();
                dates[date] = 1;
                num++;
            });
        }
        return dates;
    };
    var render = function(tweets){
        $('#tweet-heatmap').empty();
        var cal = new CalHeatMap();
        var firstTweet = tweets[tweets.length-1];
        var today = new Date();
        var twoMonthsAgo = new Date(today.getFullYear(), today.getMonth()-2, today.getDate());
        cal.init({
            itemSelector: '#tweet-heatmap',
            data: tweets,
            afterLoadData: parseTweets,
            start: twoMonthsAgo,
            range: 3,
            maxDate: today,
            domain: 'month',
            subDomain: 'x_day',
            subDomainTextFormat: '%d',
            cellSize: 20,
            domainGutter: 10,
            legend: [1,3,6,10],
            displayLegend: false,
            tooltip: true,
            previousSelector: '#prev',
            nextSelector: '#next',
            afterLoadPreviousDomain: function(date){
                if(new Date(firstTweet.created_at) > date){   //if we need to queue up older tweet data
                    loadMore();
                }
            }
        });
        var loadMore = function(){
            var username = $('#username').val();
            console.log(firstTweet);
            generate(username, firstTweet.id, function(tweets){
                firstTweet = tweets[tweets.length-1];
                cal.update(tweets, parseTweets, cal.APPEND_ON_UPDATE);
            });
        };

    };

});



