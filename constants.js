function define(name, value) {
	Object.defineProperty(exports, name, {
		value: value,
		enumerable: true
	});
}

define('URL_PING', 'http://chaosdepot.herokuapp.com');
define('URL_RECAPTCHA_POST', 'https://www.google.com/recaptcha/api/siteverify');
define('URL_RECAPTCHA_API', 'https://www.google.com/recaptcha/api.js');
define('EMAIL_ADMIN', 'crayna@naver.com');
define('TEXT_APPNAME', 'Chaos Depot');
