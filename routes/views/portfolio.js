var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = req.params.category || "home";

	// Init locals
	locals.filters = {
		category: req.params.category,
		search: req.params.search || "",
		page: req.query.page || 1,
	};

	// Category is always fetched from middleware
	locals.data.posts = [];

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			
			page: locals.filters.page,
			perPage: 10,
			maxPages: 10,
			filters: {
				title: new RegExp('^(.*?)' + locals.filters.search + '(.*?)$', "i"),
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('portfolio');
};
