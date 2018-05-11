import ContractCP from '../../ethereum/ContractCP';
import ContractPI from '../../ethereum/ContractPI';
import Accounts from '../../ethereum/const/Accounts.json';

const Cp = {
	ItemNames: { 1: 'Fever', 2: 'Backache', 3: 'Stomach ache', 4: 'Toothache', 5: 'Cancel', 6: 'General examination' },
	StatusNames: ['NEW', 'WAITING_FOR_PAID', 'CHECKING', 'DONE', 'CANCELLED'],

	getSummary: function getSummary(address) {
		const contractCP = ContractCP(address);
		return contractCP.methods.getSummary().call();
	},

	getDocument: function getDocument(address) {
		const contractCP = ContractCP(address);
		return contractCP.methods.getDocument().call();
	},

	setDocument: function setDocument(address, document) {
		const contractCP = ContractCP(address);
		return contractCP.methods.setDocument(document).send({
			from: Accounts.Clinic,
			gas: 6000000
		});
	},

	renderStatus: function renderStatus(status) {
		return Cp.StatusNames[status];
	},

	renderCheckedItems: function renderCheckedItems(inCheckedItems) {
		let names = [];
		let index = 0;
		for (let item of inCheckedItems) {
			names[index] = Cp.ItemNames[item];
			index++;
		}
		return (names);
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
	},

	calculateClaimAmount: function calculateClaimAmount(contractPIAddress, contractCPAddress) {
		const contractPI = ContractPI(contractPIAddress);
		return contractPI.methods.calculateClaimAmount(contractCPAddress).call();
		//return contractPI.methods.getSummary().call();
	}
}

export { Cp };  