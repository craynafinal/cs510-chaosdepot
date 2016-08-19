var keystone = require('keystone');
var Types = keystone.Field.Types;

// Using nodemailer instead of Keystone Mandrill to avoid using a paid service
var nodemailer = require('nodemailer');
//var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_key: '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'
    }
}

var transporter = nodemailer.createTransport(sgTransport(options));

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Just leaving a message' },
		{ value: 'question', label: 'I\'ve got a question' },
		{ value: 'other', label: 'Something else...' },
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	var enquiry = this;
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);

    /*
		new keystone.Email({
			templateExt: 'hbs',
			templateEngine: require('handlebars'),
			templateName: 'enquiry-notification',
		}).send({
			to: admins,
			from: {
				name: 'chaosdepot',
				email: 'contact@chaosdepot.herokuapp.com',
			},
			subject: 'New Enquiry for chaosdepot',
			enquiry: enquiry,
		}, callback);
    */
		console.log(enquiry);
		var mailOptions = {
			from: enquiry.email,
			to: "jsl@pdx.edu",
			subject: "title",
			text: enquiry.message.md,
			html: enquiry.message.html
		};

		console.log(mailOptions);

		transporter.sendMail(mailOptions, function(error, info) {
			if(error) { console.log(error); return callback(error); }
			console.log("sent");
			callback;
		});
	});
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
