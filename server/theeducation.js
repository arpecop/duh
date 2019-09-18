const request = require('request');
const db = require('nano')('http://localhost:5984/test');
const translate = require('translate-google');

const async = require('async');
const cheerio = require('cheerio');
function get(id) {
     request.get('https://theconversation.com/uk/education/articles?page=' + id, function(e, x, body) {
          const $ = cheerio.load(body);
          $('article').each(function(i, elem) {
               db.insert(
                    {
                         _id:
                              'https://theconversation.com' +
                              $(elem)
                                   .find('a')
                                   .attr('href'),
                    },
                    function(e) {
                         console.log('====================================');
                         console.log(e);
                         console.log('====================================');
                         get(id--);
                    }
               );
          });
     });
}

request.get('http://127.0.0.1:5984/test/_all_docs?limit=1000', function(e, x, body) {
     const rows = JSON.parse(body);

     async.eachSeries(
          rows.rows,
          function(file, outCb) {
               console.log(file);
               let arr = [];
               request.get(file.id, function(e, x, body) {
                    const $ = cheerio.load(body);
                    const content = $('.content-body').text();

                    async.each(
                         content.split('\n'),
                         function(file1, outCb1) {
                              translate(file1, { from: 'en', to: 'bg' })
                                   .then(res => {
                                        arr.push(res);
                                   })
                                   .catch(err => {
                                        console.error(err);
                                   });
                         },
                         function(err) {
                              console.log('all done!!!');
                         }
                    );
               });
          },
          function(err) {
               console.log('all done!!!');
          }
     );
});

//get(57);
