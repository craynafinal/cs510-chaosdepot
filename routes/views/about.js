var keystone = require('keystone');
var i18n = require('i18n');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'about';

	// Render the view
	view.render('about');
};
