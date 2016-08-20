var constants = require('../../constants');
var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var request = require('request');
var i18n = require('i18n');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.captchaSiteKey = process.env.RECAPTCHA_SITEKEY;
	locals.captchaAPI = constants.URL_RECAPTCHA_API;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

/*
		if (req.body['g-recaptcha-response'] === null || req.body['g-recaptcha-response'] === undefined) {
			console.log("ddd");
			return false;
		}
*/

		console.log(i18n.__('Hello'));


/*
		// Captcha verification
		request.post(
			constants.URL_RECAPTCHA_POST,
			{ form: {
					secret: process.env.RECAPTCHA_SECRET,
					response: req.body['g-recaptcha-response']
				}
			},
			function (error, response, body) {
				if (!error && response.statusCode == 200 && body.success) {
				} else {
					//locals.messages.error = 'test';
				}
			}
		);
*/
		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				console.log(err.errors);
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});

	});

	view.render('contact');
};
