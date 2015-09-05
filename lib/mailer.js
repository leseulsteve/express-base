'use strict';

function Mailer(app) {
	
	return {

		init: function(config, mailer) {

			app.route('/' + config.url).post(function(req, res) {

				var mailOptions = {
					from: req.body.from,
					to: config.addresses[req.body.to],
					subject: req.body.subject,
					text: req.body.body,
				};

				mailer.sendMail(mailOptions, function(error, info) {
					if (error) {
						res.status(400).send(error);
					}
					res.status(200).send({
						message: info
					});
				});
			});
		}
	};
}

module.exports = new Mailer();