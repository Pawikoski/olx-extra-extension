'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    popup: PATHS.src + '/popup.js',
    'contentScripts/comments': PATHS.src + '/contentScripts/comments.js',
    background: PATHS.src + '/background.js',
  },
});

module.exports = config;
