var constants = require('../../constants');
var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var request = require('request');

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

		// Captcha verification
		request.post(
			constants.URL_RECAPTCHA_POST,
			{ form: {
					secret: process.env.RECAPTCHA_SECRET,
					response: req.body['g-recaptcha-response']
				}
			},
			function (error, response, body) {
				if (!error && response.statusCode == 200 && JSON.parse(body).success) {
					checkAndSendMessage(next);
				} else {
					captchaFail(next);
				}
			}
		);
	});

	function checkAndSendMessage(next) {
    var newEnquiry = new Enquiry.model();
    var updater = newEnquiry.getUpdateHandler(req);

    updater.process(req.body, {
      flashErrors: true,
      fields: 'name, email, phone, enquiryType, message',
      errorMessage: 'There was a problem submitting your enquiry:',
    }, function (err) {
      if (err) {
        locals.validationErrors = err.errors;
      } else {
        locals.enquirySubmitted = true;
      }
			next();
		});
	}

	function captchaFail(next) {
		req.flash('error', { detail: 'You must solve the captcha to send a message.' });
		next();
	}

	view.render('contact');
};
