const routes = require('next-routes')();

routes
	.add('/patient/insurer/new', '/patient/insurer/new')
	.add('/patient/insurer/register/:pack', '/patient/insurer/register')
	.add('/patient/insurer/view/:address', '/patient/insurer/view')

	.add('/patient/clinic/new', '/patient/clinic/new')
	.add('/patient/clinic/register/:clinic_name', '/patient/clinic/register')
	.add('/patient/clinic/view/:address', '/patient/clinic/view')

	.add('/clinic/view/:address', '/clinic/view')
	.add('/clinic/document/:address', '/clinic/document')

	.add('/insurer/view/:address', '/insurer/view')
	.add('/insurer/claimqueue/:address', '/insurer/claimqueue')

	.add('/ipfs', '/ipfs')

	.add('/admin/event', '/admin/event')

module.exports = routes;
