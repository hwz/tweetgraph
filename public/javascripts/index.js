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
        console.log(num);
        return dates;
    };
    var render = function(tweets){;
        $('#tweet-heatmap').empty();
        var cal = new CalHeatMap();
        var first_id = tweets[tweets.length-1].id;
        var firstDate = new Date(tweets[tweets.length-1].created_at);
        var today = new Date();
        cal.init({
            itemSelector: '#tweet-heatmap',
            data: tweets,
            afterLoadData: parseTweets,
            start: firstDate,
            range: 6,
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
                console.log(date);
                if(firstDate > date){   //if we need to queue up older tweet data
                    loadMore();
                }
            }
        });
        var loadMore = function(){
            var username = $('#username').val();
            generate(username, first_id-1, function(tweets){
                console.log(tweets);
                cal.update(tweets, parseTweets, cal.APPEND_ON_UPDATE);
                first_id = tweets[tweets.length-1].id;
                console.log(first_id); 
            });
        };

    };

});



