const config = require('config');
const fs = require('fs');
const request = require('request');
const TwitterPackage = require('twitter');

const fileName = 'tweets.log';
const twitterConfig = {
  consumer_key: process.env.CONSUMER_KEY || config.get('twitter.credentials.consumer_key'),
  consumer_secret: process.env.CONSUMER_SECRET || config.get('twitter.credentials.consumer_secret'),
  access_token_key: process.env.ACCESS_TOKEN_KEY || config.get('twitter.credentials.access_token_key'),
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || config.get('twitter.credentials.access_token_secret'),
};
const productToTweet = config.get('source.jsonEndPoint');
const preface = 'Check out:';
const twitterLinkLength = 24; // Twitter counts all URLs as 24 characters.
const maxTweetLength = 138 - twitterLinkLength.length - preface.length;


/*
 * Find out if a NID has already been used for a tweet.
 */
const hasThisAlreadyBeenTweeted = (nid, listOfTweetedNodes) => {
  if (listOfTweetedNodes && listOfTweetedNodes.indexOf(nid) > -1) {
    return true;
  }
  return false;
};


/*
 * Get a list of all previously tweeted nodes.
 */
const getListOfTweetedProducts = () => {
  if (fs.existsSync(fileName)) {
    const nodes = String(fs.readFileSync(fileName, 'utf8')).replace(/(\r\n|\n|\r)/gm, '').split(',');
    return nodes;
  }
  return false;
};
let listOfTweetedNodes = getListOfTweetedProducts();


/*
 * Log NIDs of products that have been tweeted.
 */
const logTweets = (newProductNID) => {
  if (!listOfTweetedNodes) {
    listOfTweetedNodes = [];
  }
  listOfTweetedNodes.push(newProductNID);
  fs.writeFile(fileName, listOfTweetedNodes, (error) => {
    if (error) { return console.log(error); }
    return true;
  });
};


/*
 * Tweet a Fate product.
 */
const tweetPost = (data) => {
  const productLink = data.nodes[0].node.field_link;
  const productNID = data.nodes[0].node.Nid;
  let productTitle = data.nodes[0].node.title;
  if (productTitle > maxTweetLength) {
    productTitle = data.nodes[0].node.title.substring(0, maxTweetLength);
  }
  const tweet = `${preface} ${productTitle} ${productLink}`;

  /*
   * Post a status update to Twitter.
   */
  const Twitter = new TwitterPackage(twitterConfig);
  Twitter.post('statuses/update', { status: tweet }, (error) => {
    if (error) {
      console.log(error);
    }
  });

  /*
   * Log tweets that have been sent out.
   */
  logTweets(productNID);
};


/*
 *  Get random product from fate-srd.com/json.
 */
function getProductToTweet() {
  request.get({
    url: productToTweet,
    json: true,
    headers: { 'User-Agent': 'request' },
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else if (!hasThisAlreadyBeenTweeted(data.nodes[0].node.Nid)) {
      tweetPost(data);
    } else {
      // TODO Limit how many times it will retry.
      console.log('This product has already been tweeted. Trying again...');
      getProductToTweet();
    }
  });
}

getProductToTweet();
