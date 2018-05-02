const routes = require('next-routes')();

routes
	.add('/patient/insurer/new', '/patient/insurer/new')
	.add('/patient/insurer/confirm/:pack', '/patient/insurer/confirm')
	.add('/patient/insurer/view/:address', '/patient/insurer/view')

module.exports = routes;
