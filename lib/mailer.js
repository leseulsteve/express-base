'use strict';

var Mailer = function(app) {
	this.app = app;
};

Mailer.prototype.init = function(config, mailer) {

	this.app.route('/' + config.url)
		.post(function(req, res) {

			var mailOptions = {
				from: req.body.from,
				to: config.addresses[req.body.to],
				subject: req.body.subject,
				text: req.body.body,
			};

			MailTransporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					res.status(400).send(error);
				}
				res.status(200).send({
					message: info
				});
			});
		});
};

module.exports = new Mailer();