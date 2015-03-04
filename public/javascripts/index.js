$(function(){
    $('#generate').click(function(){
        var username = $('#username').val();
        generate(username);
    });

    var generate = function(username, max_id){
        var url = '/tweets/'+username;
        if(arguments.length > 1){
            url = url+'?max_id=' + max_id;
        }
        $.get(url, function(data){
            render(data);
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
    }
    var render = function(tweets){;
        var dates = parseTweets(tweets);
        $('#tweet-heatmap').empty();
        var cal = new CalHeatMap();
        var first_id = tweets[tweets.length-1].id;
        var firstDate = new Date(tweets[tweets.length-1].created_at);
        var today = new Date();
        cal.init({
            itemSelector: '#tweet-heatmap',
            data: dates,
            start: firstDate,
            range: 6,
            maxDate: today,
            domain: 'month',
            subDomain: 'x_day',
            subDomainTextFormat: '%d',
            cellSize: 20,
            domainGutter: 10,
            displayLegend: false,
            tooltip: true,
            previousSelector: '#prev',
            nextSelector: '#next',
            afterLoadPreviousDomain: function(date){
                if(date < firstDate){   //if we need to queue up older tweet data
                    var username = $('#username').val();
                    var url = '/tweets/'+username+'?max_id=' + (first_id - 1);
                    console.log(url);
                    $.get(url, function(data){
                        console.log("hi");
                        var moreDates = parseTweets(data);
                        cal.update(moreDates, false, cal.APPEND_ON_UPDATE);
                        
                    });
                        
                    
                }
            }
        });

    };

});



