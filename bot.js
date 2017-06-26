// Dependencies =========================
var  
    twit = require('twit'),
    config = require('./config');

var Twitter = new twit(config);

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {  
    var params = {
        q: '#lebron',  // REQUIRED
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

// grab & retweet as soon as program is running...
retweet();  
// retweet in every 50 minutes
setInterval(retweet, 3000000);

// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){  
  var params = {
      q: '#NBA, #Lebron, #Cavs',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
        }
      });
    }
  });
}
// grab & 'favorite' as soon as program is running...
favoriteTweet();  
// 'favorite' a tweet in every 60 minutes
setInterval(favoriteTweet, 3600000);

// function to generate a random tweet tweet
function ranDom (arr) {  
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};


/// FOLLOWED BOT


var stream =Twitter.stream('user');
stream.on('follow', followed);

function followed(eventMsg){
	console.log("follow event");
	var name = eventMsg.source.name;
	var screenName =eventMsg.source.screen_name;
	tweetIt('@'+screenName+'hi , thank you for following me');
}

function tweetIt(txt){
	var tweet ={
	status:txt
	}
	
	Twitter.post('statuses/update',tweet,tweeted);
	
	function tweeted(err,data,response){
		if(err){
			console.log("wrong");
		}
		else {
			console.log("good");
		}
	}
}




/////////////////////////////////////////////////////////////////////////////////

/// REPLY BOT 


var stream = Twitter.stream('statuses/filter', { track: ['#LeBron, #nba'] });
stream.on('tweet', tweetEvent);
var randomItem = 0;
var randomPost = 0;

function tweetEvent(tweet) {

    // Who sent the tweet?
    var name = tweet.user.screen_name;
    // What is the text?
    // var txt = tweet.text;
    // the status update or tweet ID in which we will reply
    var tweetID  = tweet.id_str;

     // Get rid of the @ mention
    // var txt = txt.replace(/@machluf_or/g, "");

    // Start a reply back to the sender
	
	var gifArray = ['http://gph.is/2jtFbfT','http://gph.is/2oN3YQj','http://gph.is/29UC2VY','http://gph.is/24rbWOW','http://gph.is/2lImB3r','http://gph.is/2lbMDPI','http://gph.is/2nl8Olv'];
	
	var postArray = [' Lets go Cavs!! ',' LeBron the King !! ',' NBA RULLZ!! ', ' When is the Allstar weekend? ' ,' this is an A++ bot right here! '];
	
	randomItem=randomItem+1;
	randomItem=randomItem%7;
	
	randomPost=randomPost+1;
	randomPost=randomPost%5;
	
   var reply = "@" + name + ' ' + postArray[randomPost]+ gifArray[randomItem];
    var params             = {
                              status: reply,
                              in_reply_to_status_id: tweetID
                             };

    Twitter.post('statuses/update', params, function(err, data, response) {
      if (err !== undefined) {
        console.log(err);
      } else {
        console.log('Tweeted: ' + params.status);
      }
    })
};






















