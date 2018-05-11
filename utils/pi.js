import ContractPI from '../ethereum/ContractPI';

const Pi = {

	getSummary: function getSummary(address) {
		const contractPI = ContractPI(address);
		return contractPI.methods.getSummary().call();
	},

	renderStatus: function renderStatus(status) {
		var _status = "N/A";
		if (status == 0) {
			_status = "[NEW] Waiting for patient confirm";
		}
		else if (status == 1) {
			_status = "[VALID] Patient can use now";
		}
		else if (status == 2) {
			_status = "[EXPIRED] Insurer can withdraw";
		}
		else if (status == 3) {
			_status = "[CANCELLED] by Patient";
		}
		return _status;
	},

	renderStatusColor: function renderStatusColor(status) {
		let color = 'black';
		if (status == 0) {
			color = 'olive';
		}
		else if (status == 1) {
			color = 'green';
		}
		else if (status == 2) {
			color = 'brown';
		}
		else if (status == 3) {
			color = 'black';
		}
		return color;
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