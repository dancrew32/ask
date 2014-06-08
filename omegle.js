var system = require('system');

var Omegle = function() {
	this.config = {
		image: 'output.png',
		user_agent: 'AskBot(https://github.com/dancrew32/ask)',
		viewport_width: 1000,
		viewport_height: 800,
		max_conversation: 3 * 60 * 1000 // 3 mins
	};
	this.route = {
		home: 'http://www.omegle.com'
	};
	this.page = this._getPage();
	this.setUserAgent();
	this.resetViewport();
};
module.exports = Omegle;

Omegle.prototype._getPage = function() {
	return require('webpage').create();
};

Omegle.prototype.resetViewport = function() {
	this.page.viewportSize = {
		width: this.config.viewport_width, 
		height: this.config.viewport_height
	};
};

Omegle.prototype.setUserAgent = function(agent) {
	this.page.settings.userAgent = agent || this.config.user_agent;
};

Omegle.prototype.waitFor = function(shouldAdvance, cb) {
	var self = this;
	var start = new Date().getTime();
	var condition = false;
	var interval = setInterval(function() {
		if ((new Date().getTime() - start < self.config.max_conversation) && !condition) {
			condition = (typeof (shouldAdvance) === "string" ? eval(shouldAdvance) : shouldAdvance());
		} else {
			if (!condition) {
				typeof (cb) === "string" ? eval(cb) : cb();
				clearInterval(interval);
			} else {
				typeof (cb) === "string" ? eval(cb) : cb();
				clearInterval(interval);
			}
		}
	}, 500);
};

Omegle.prototype.readLogs = function() {
	var out = [];
	var items = document.querySelectorAll('.logbox')[0].querySelectorAll('.logitem');
	for (var i in items) {
		var item = items[i];
		if (typeof item.querySelectorAll === 'function') {
			var is_you = item.querySelectorAll('.youmsg').length;
			var is_them = item.querySelectorAll('.strangermsg').length;
			if (is_you || is_them)
				out.push(item.innerText.trim())
		}
	};
	return JSON.stringify(out);
};

Omegle.prototype.isChatEnd = function() {
	var log_box = document.querySelectorAll('.logbox');
	if (log_box.length)
		var next = log_box[0].querySelectorAll('.newchatbtnwrapper img');
		if (next.length)
			return true;
	return false;
};

Omegle.prototype.screenCap = function(filename) {
	filename = filename || this.config.image;
	return this.page.render(filename)
};

Omegle.prototype.getConversation = function(cb) {
	var self = this;
	this.waitFor(function() {
		self.screenCap();
		return self.page.evaluate(self.isChatEnd);
	}, function() {
		self.screenCap();
		cb(self.page.evaluate(self.readLogs));
		phantom.exit();
	});
};

Omegle.prototype.askQuestion = function(question, cb) {
	var self = this;
	this.page.open(this.route.home, function(status) {
		setTimeout(function() {
			self.page.evaluate(self._askBrowser, question);
			self.getConversation(cb);
		}, 2000);
	});
};

Omegle.prototype._askBrowser = function(question) {
	var fire = function(obj, ev) {
		var evt = document.createEvent('HTMLEvents');
		evt.initEvent(ev, false, true);
		return !obj.dispatchEvent(evt);
	};
	var type = {
		text: document.querySelector('#textbtn'), 
		video: document.querySelector('#videobtn'), 
		text_spy: document.querySelectorAll('#textbtnstatus a')[0],
		video_unmoderated: document.querySelectorAll('#videobtnstatus a')[0]
	};
	fire(type.text_spy, 'click');
	var spy_context = document.querySelector('#tryspymodetext');
	var anchor_test = spy_context.querySelectorAll('a');
	if (anchor_test.length === 1)
		if (anchor_test[0].innerHTML === 'asking a question')
			fire(anchor_test[0], 'click');
	document.querySelectorAll('.questionInput')[0].value = question;
	var ask = spy_context.querySelectorAll('button')[0];
	fire(ask, 'click');
};
