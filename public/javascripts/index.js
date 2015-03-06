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
            callback(data);
        });

    };
    var parseTweets = function(tweets){
        var dates = {};
        if (tweets.length > 0) {
            $.each(tweets, function(count, tweet){
                var date = (new Date(tweet.created_at)).getTime();
                date = (date/1000).toString();
                dates[date] = 1;
            });
        }
        return dates;
    };
    var render = function(tweets){
        $('#tweet-heatmap').empty();
        var cal = new CalHeatMap();
        var firstTweet = tweets[tweets.length-1];
        var today = new Date();
        var twoMonthsAgo = new Date(today); twoMonthsAgo.setMonth(twoMonthsAgo.getMonth()-2);

        var loadMore = function(){
            var username = $('#username').val();
            generate(username, firstTweet.id_str, function(tweets){
                if(tweets !== undefined && tweets.length !== 0){
                    firstTweet = tweets[tweets.length-1];
                    cal.update(tweets, parseTweets, cal.APPEND_ON_UPDATE);
                    cal.options.data = cal.options.data.concat(tweets);    
                }
                else{
                    cal.options.minDate = new Date(firstTweet.created_at);
                }
            });
        };
        cal.init({
            itemSelector: '#tweet-heatmap',
            itemName: ["tweet", "tweets"],
            label: {
                position: "top"
            },
            legend: [1,2,4,6,8,10],
            legendColors: {
                min: "#efefef",
                max: "#4682b4",
                empty: "white"
            },
            data: tweets,
            afterLoadData: parseTweets,
            start: twoMonthsAgo,
            range: 3,
            maxDate: today,
            domain: 'month',
            subDomain: 'x_day',
            subDomainTextFormat: '%d',
            cellSize: 30,
            domainGutter: 10,
            displayLegend: false,
            tooltip: true,
            previousSelector: '#prev',
            nextSelector: '#next',
            afterLoad: function(){
                $('.control').show();
                if(new Date(firstTweet.created_at) > twoMonthsAgo){
                    loadMore();
                }
            },
            afterLoadPreviousDomain: function(date){
                var prevMonth = new Date(date); prevMonth.setMonth(twoMonthsAgo.getMonth()-1);
                if(new Date(firstTweet.created_at) > prevMonth){   //if we need to queue up older tweet data
                    loadMore();
                }
            }
        });

    };

});



