var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	sortable: true,
});

Post.add({
	title: { type: String, required: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, default: Date.now, index: true, dependsOn: { state: 'published' } },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true  },
	style: { type: Types.Select, options: 'default, book, webapp', default: 'default', index: true },
	link: { type: Types.Url, dependsOn: { style: 'webapp' } },
	images: { type: Types.CloudinaryImages, autoCleanup: true },
	content: { type: Types.Html, wysiwyg: true, height: 400 },
  meta: {
		title: { type: String },
		description: { type: String }
  },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
