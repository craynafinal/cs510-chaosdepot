var keystone = require('keystone');

/**
 * Category Model
 * ==============
 */

var Category = new keystone.List('Category', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Category.add({
	name: { type: String, required: true },
});

Category.relationship({ ref: 'Portfolio', path: 'categories' });

Category.register();
