const config = require('config');
const fs = require('fs');

const fileName = config.get('log');

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
console.log(getListOfTweetedProducts());
