var keystone = require('keystone'); 
var async = require('async'); 
 
exports = module.exports = function (req, res) { 
 
  var view = new keystone.View(req, res); 
  var locals = res.locals; 
 
  // Init locals 
  locals.section = 'search'; 
  locals.filters = { 
    category: req.params.category, 
  }; 
  locals.data = { 
    posts: [], 
    categories: [], 
  };

	view.on('post', function (next) {

    console.log("post");

   	 
    keystone.list('Post').model.find({
      title: new RegExp('^(.*?)' + req.body.searchKey + '(.*?)$', "i")
      //title: 'post1'
    }, function(err, results) {
      console.log(results);
      // Do your action here..
      locals.data.locations = results;
      if (results == ''){
        locals.data.invalid = 'Invalid search';
      }
      next(err);
    });
		
  });

	// Render the view
  view.render('search');
};
