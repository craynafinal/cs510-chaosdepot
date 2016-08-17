function define(name, value) {
	Object.defineProperty(exports, name, {
		value: value,
		enumerable: true
	});
}

define('URL_PING', 'http://chaosdepot.herokuapp.com');
define('EMAIL_ADMIN', 'crayna@naver.com');
define('TEXT_APPNAME', 'chaosdepot');
