const TwitterPackage = require('twitter');
const request = require('request');
const config = require('config');

const twitterConfig = {
  consumer_key: process.env.CONSUMER_KEY || config.get('twitter.credentials.consumer_key'),
  consumer_secret: process.env.CONSUMER_SECRET || config.get('twitter.credentials.consumer_secret'),
  access_token_key: process.env.ACCESS_TOKEN_KEY || config.get('twitter.credentials.access_token_key'),
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || config.get('twitter.credentials.access_token_secret'),
};

const productToTweet = config.get('source.jsonEndPoint');
const preText = 'Check out:';
const twitterLinkLength = 24; // Twitter counts all URLs as 24 characters.
const maxTweetLength = 138 - twitterLinkLength.length - preText.length;

/*
 * Tweet a Fate product.
 */
const tweetPost = function tweetOutProduct(data) {
  const productLink = data.nodes[0].node.field_link;
  let productTitle;

  if (data.nodes[0].node.title.length > maxTweetLength) {
    productTitle = data.nodes[0].node.title.substring(0, maxTweetLength);
  } else {
    productTitle = data.nodes[0].node.title;
  }

  const tweet = `${preText} ${productTitle} ${productLink}`;

  /*
   * Post a status update to Twitter.
   */
  const Twitter = new TwitterPackage(twitterConfig);
  Twitter.post('statuses/update', { status: tweet }, (error) => {
    if (error) {
      console.log(error);
    }
  });
};

/*
 *  Get random product from fate-srd.com/json.
 */
request.get({
  url: productToTweet,
  json: true,
  headers: { 'User-Agent': 'request' },
}, (err, res, data) => {
  if (err) {
    console.log('Error:', err);
  } else if (res.statusCode !== 200) {
    console.log('Status:', res.statusCode);
  } else {
    tweetPost(data);
  }
});
