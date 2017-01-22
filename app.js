const TwitterPackage = require('twitter');
const request = require('request');

// eslint import/no-unresolved: "off"
const config = require('./config.local.js');

const preText = 'Check out:';
const twitterLinkLength = 24; // Twitter counts all URLs as 24 characters.
const maxTweetLength = 138 - twitterLinkLength.length - preText.length;
const productToTweet = config.jsonEndPoint;

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

  const tweet = `${preText} ${productTitle} ${productLink}'`;

  console.log(tweet);

  /*
   * Post a status update to Twitter.
   */
  const Twitter = new TwitterPackage(config);
  Twitter.post('statuses/update', { status: tweet }, (error, tweetContent, response) => {
    if (error) {
      console.log(error);
    }
    console.log(tweetContent);  // Tweet content.
    console.log(response);  // Raw response object from Twitter.
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
