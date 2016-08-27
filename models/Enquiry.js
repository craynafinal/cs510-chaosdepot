// Using nodemailer instead of Keystone Mandrill to avoid using a paid service
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_key: process.env.SENDGRID_API
    }
}

var transporter = nodemailer.createTransport(sgTransport(options));

var keystone = require('keystone');
var Types = keystone.Field.Types;

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

		var mailOptions = {
			from: enquiry.email,
			to: admins.map(function(admin) {
				return admin.email;
			}).join(","),
			subject: "Received an email from " + enquiry.name.first,
			text: enquiry.message.md,
			html: enquiry.message.html
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if(error) return callback(error);
			callback;
		});
	});
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, createdAt';
Enquiry.register();
