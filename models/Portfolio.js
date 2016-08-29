var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Portfolio Model
 * ===============
 */

var Portfolio = new keystone.List('Portfolio', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Portfolio.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
	publishedDate: { type: Types.Date, default: Date.now, index: true, dependsOn: { state: 'published' } },
	categories: { type: Types.Relationship, ref: 'Category', many: true  },
	style: { type: Types.Select, options: 'default, book, webapp', default: 'default', index: true },
	link: { type: Types.Url, dependsOn: { style: 'webapp' } },
	images: { type: Types.CloudinaryImages, autoCleanup: true },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
});

Portfolio.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Portfolio.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Portfolio.register();
