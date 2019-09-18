const request = require('request');
const nano = require('nano');
const async = require('async');
function get(id) {
  request.get('https://theconversation.com/uk/education/articles?page=' + id, function(
    e,
    x,
    body,
  ) {});
}

get(57);
