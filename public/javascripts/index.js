$(function(){
    $('#userform').submit(function(event){
        event.preventDefault();
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
    var render = function(data){
        $('#tweet-heatmap').empty();
        var cal = new CalHeatMap();
        var minTweet = data.min_tweet;
        var today = new Date();
        var twoMonthsAgo = new Date(today); twoMonthsAgo.setMonth(twoMonthsAgo.getMonth()-2);

        var loadMore = function(){
            var username = $('#username').val();
            generate(username, minTweet.id_str, function(data){
                if(Object.keys(data).length > 0){   //if data isnt empty
                    minTweet = data.min_tweet;
                    $.extend(cal.options.data, data.dates);
                    cal.update(cal.options.data);
                }
                else{
                    cal.options.minDate = new Date(minTweet.created_at);
                }
            });
        };
        cal.init({
            itemSelector: '#tweet-heatmap',
            itemName: ["tweet", "tweets"],
            label: {
                position: "top",
            },
            legend: [1,2,4,6,8,10],
            legendColors: {
                min: "#D9EBF9",
                max: "#0C89E8",
                empty: "white"
            },
            data: data.dates,
            start: twoMonthsAgo,
            range: 3,
            maxDate: today,
            domain: 'month',
            subDomain: 'x_day',
            subDomainTextFormat: '%d',
            cellSize: 30,
            domainGutter: 10,
            displayLegend: true,
            legendMargin: [0, 0, 0, 10],
            tooltip: true,
            previousSelector: '#prev',
            nextSelector: '#next',
            afterLoad: function(){
                $('.cal-control').show();
                if(new Date(minTweet.created_at) > twoMonthsAgo){
                    loadMore();
                }
            },
            afterLoadPreviousDomain: function(date){
                var prevMonth = new Date(date); prevMonth.setMonth(twoMonthsAgo.getMonth()-1);
                if(new Date(minTweet.created_at) > prevMonth){   //if we need to queue up older tweet data
                    loadMore();
                }
            }
        });

    };

});



