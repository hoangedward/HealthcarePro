import web3 from '../ethereum/web3';

const eth = {  

  fromWei: function fromWei(value, uint) {
		if(typeof value === "undefined") {
			value = '0';
		}
		return web3.utils.fromWei('' + value, uint);
	},
	
	toWei: function toWei(value, uint) {
		if(typeof value === "undefined") {
			value = '0';
		}
		return web3.utils.toWei('' + value, uint);
	}
}

export { eth };  