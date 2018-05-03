const routes = require('next-routes')();

routes
	.add('/patient/insurer/new', '/patient/insurer/new')
	.add('/patient/insurer/register/:pack', '/patient/insurer/register')
	.add('/patient/insurer/view/:address', '/patient/insurer/view')
	.add('/patient/clinic/new', '/patient/clinic/new')
	.add('/patient/clinic/register/:clinic_name', '/patient/clinic/register')

module.exports = routes;
