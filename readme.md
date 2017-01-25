[![Build Status](https://travis-ci.org/amazingrando/fate-product-tweeter.svg?branch=master)](https://travis-ci.org/amazingrando/fate-product-tweeter)

# Fate SRD auto tweeter

This project creates a script that will pull a random product from fate-srd.com and post about it to the @FateSRD twitter account.

The project is based on the advice of http://techknights.org/workshops/nodejs-twitterbot/.

## Requirements

- NodeJS (tested with 7+)
- Yarn for package management

## Installation

- `git clone` this repo and `cd` into it.
- `yarn` to install packages
- Create a [Twitter app](https://apps.twitter.com/), including Access Tokens.
- Add your tokens in Heroku. If you'd like to test locally, enter them into `config/default.yml`.
- You will also need to set the source for the json in either `config/default.yml` or `config/production.yml`, depending on your environment.

## How to Use

- Run `node app.js`

## Heroku Deployment

Deploy to Heroku's master branch.
