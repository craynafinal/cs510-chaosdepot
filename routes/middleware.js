/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');
var i18n = require('i18n');
var constants = require('../constants'); 

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	getAllCategories(req, res, next);
};

function getAllCategories(req, res, next) {
	// Category needed for menu bar	
	keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

		if (err || !results.length) {
			results = [];
		}
		
		setupLocals(results, req, res, next);
	});
}

function setupLocals(categories, req, res, next) {
	// Keep the categories for other usages
	res.locals.data = { categories: categories };

	// Menus excluding categories
	res.locals.navLinks = [
		{ label: 'About', key: 'about', href: '/about' },
		{ label: 'Contact', key: 'contact', href: '/contact' },
	];

	// Menus for categories
	res.locals.categoryLinks = [ { label: 'Home', key: 'home', href: '/' } ];

	for (var i in categories) {
		res.locals.categoryLinks.push({ label: categories[i].name, key: categories[i].key, href: '/category/' + categories[i].key });
	}

	res.locals.user = req.user;

	var date = new Date();
	res.locals.date = { year: date.getFullYear() };

	// Get all locales for language selector at the bottom
	res.locals.locales = i18n.getLocales();
	res.locals.locale = i18n.getLocale();

	// Get text information
	res.locals.title = constants.TEXT_APP_NAME;
	res.locals.description = constants.TEXT_APP_DESCRIPTION;

	next();
}

/**
  Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {
	
	res.err = function(err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}
	
	res.notfound = function(title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}
	next();  
};

/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

/**
	Handles locale settings and redirections
 */
exports.detectLanguage = function(req, res, next) {
	var urlLocale = req.url.split('/')[1];

	if (i18n.getLocales().indexOf(urlLocale) !== -1) {
		i18n.setLocale(urlLocale);
		next();
	} else {
		var currentLocale = i18n.getLocale();

		res.redirect(urlLocale.length === 2 ? req.url.replace(urlLocale, currentLocale) : '/' + currentLocale + req.url); 
	}

}
