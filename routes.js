const routes = require('next-routes')();

routes
	.add('/patient/insurer/new', '/patient/insurer/new')
	.add('/patient/insurer/confirm/:pack', '/patient/insurer/confirm')
	.add('/patient/insurer/view/:address', '/patient/insurer/view')
	.add('/patient/clinic/new', '/patient/clinic/new')
	.add('/patient/clinic/confirm/:clinic_name', '/patient/clinic/confirm')

module.exports = routes;
