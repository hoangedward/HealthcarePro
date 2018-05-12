import web3 from '../ethereum/web3';

const eth = {

	fromWei: function fromWei(value, uint) {
		if (typeof value === "undefined") {
			value = '0';
		}
		return web3.utils.fromWei('' + value, uint);
	},

	toWei: function toWei(value, uint) {
		if (typeof value === "undefined") {
			value = '0';
		}
		return web3.utils.toWei('' + value, uint);
	},

	renderAccount: function renderAccount(account) {
		if(account == '0x0000000000000000000000000000000000000000') {
			return 'Unspecified';
		}
		return account;
	}
}

export { eth };  