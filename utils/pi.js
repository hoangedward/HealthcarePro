import ContractPI from '../ethereum/ContractPI';

const Pi = {

	getSummary: function getSummary(address) {
		const contractPI = ContractPI(address);
		return contractPI.methods.getSummary().call();
	},

	renderStatus: function renderStatus(status) {
		var _status = "N/A";
		if (status == 0) {
			_status = "[NEW] Waiting for Patient confirm";
		}
		else if (status == 1) {
			_status = "[CONFIRMED] by Patient";
		}
		else if (status == 2) {
			_status = "[CONFIRMED] by Insurer. Valid to use!!!";
		}
		else if (status == 3) {
			_status = "[EXPIRED] Insurer can withdraw";
		}
		else if (status == 4) {
			_status = "[REJECTED] by Insurer";
		}
		else if (status == 5) {
			_status = "[CANCELLED] by Patient";
		}
		return _status;
	},

	renderStatusColor: function renderStatusColor(status) {
		let color = 'black';
		if (status == 0) {
			color = 'olive';
		}
		if (status == 1) {
			color = 'blue';
		}
		else if (status == 2) {
			color = 'green';
		}
		else if (status == 3) {
			color = 'brown';
		}
		else if (status == 4) {
			color = 'red';
		}
		else if (status == 5) {
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