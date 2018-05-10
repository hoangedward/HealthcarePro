import ContractPI from '../ethereum/ContractPI';

const Pi = {

	getSummary: function getSummary(address) {
		const contractPI = ContractPI(address);
		return contractPI.methods.getSummary().call();
	},

	renderStatus: function renderStatus(status) {
		var _status = "N/A";
		if (status == 0) {
			_status = "Waiting for patient confirm";
		}
		else if (status == 1) {
			_status = "Valid";
		}
		return _status;
	},

	renderPackName: function renderPackName(packId) {
		var _packName = "N/A";
		if (packId == 1) {
			_packName = "General Pack";
		}
		else if (packId == 2) {
			_packName = "Premium Pack";
		}
		return (_packName);
	},

	renderPeriod: function renderPeriod(period) {
		var _period = "-";
		if (period == 6) {
			_period = "6 months";
		}
		else if (period == 12) {
			_period = "1 year";
		}
		return _period;
	}
}

export { Pi };  