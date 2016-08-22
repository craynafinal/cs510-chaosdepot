var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'post';
	locals.filters = {
		post: req.params.post,
		category: req.params.category,
	};
	locals.data = {
		posts: [],
	};

	// Load the current post
	view.on('init', function (next) {
		var category = locals.filters.category;
		if (category !== null && category !== undefined) {
			if (category === 'nocategory') {
				loadItem(null, next);
			} else {	
				loadCategoryItem(next);
			}
		} else {
			res.notfound();
		}
	});

	function loadCategoryItem(next) {
		keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
			if (result === null || result === undefined) {
				res.notfound();
			} else {
				loadItem(result, next);
			}
		});
	}

	function loadItem(category, next) {
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories');

		if (category !== null && category !== undefined) {
			q.where('categories').in([category]);
		} else {
			q.where('categories').size(0);
		}

		q.exec(function (err, result) {
			console.log(result);
			// If not found, return 404 error
			if (result === null || result === undefined) {
				res.notfound();
			} else {
				locals.data.post = result;
				next(err);
			}
		});
	}

	// Possible use for showing related items
	// Load other posts
	view.on('init', function (next) {

		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('post');
};
