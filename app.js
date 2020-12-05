const config = require('config');
const fetch = require('node-fetch');
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY || config.get('twitter.credentials.consumer_key'),
  consumer_secret: process.env.CONSUMER_SECRET || config.get('twitter.credentials.consumer_secret'),
  access_token_key: process.env.ACCESS_TOKEN_KEY || config.get('twitter.credentials.access_token_key'),
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || config.get('twitter.credentials.access_token_secret'),
});
const productList = config.get('source.jsonEndPoint');
const preface = 'Check out:';

const constructTweet = (title, url) => `${preface} "${title}" at ${url}`;

const getRandomProduct = () => fetch(productList) // eslint-disable-this-line no-undef
  .then((response) => response.json())
  .then((data) => {
    const randomProperty = (obj) => {
      const keys = Object.keys(obj);
      // eslint-disable-next-line no-bitwise
      return obj[keys[keys.length * Math.random() << 0]];
    };
    const productToTweet = randomProperty(data.data);
    const { title } = productToTweet.attributes;
    const url = productToTweet.attributes.field_link.uri;
    const tweet = constructTweet(title, url);

    client.post('statuses/update', { status: tweet }, (error, content, response) => {
      if (error) throw error;
      console.log(content); // Tweet body.
      console.log(response); // Raw response object.
    });
  })
  .catch((err) => {
    // This is where you run code if the server returns any errors
    console.log('There was an error.', err);
  });

const tweetProduct = () => {
  getRandomProduct();
};

tweetProduct();
