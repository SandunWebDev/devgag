/*
 * Main Javascript file for devgag_api, frontend UI.
 * This file bundles all of our javascript together using webpack.
 */

// Third-party JavaScript modules.
require('@fortawesome/fontawesome-free');
require('jquery');
require('bootstrap');

require.context(
    '../img', // Context folder
    true, // Include subdirectories
    /.*/, // RegExp
);

// Importing Our Code
require('./myScript');
