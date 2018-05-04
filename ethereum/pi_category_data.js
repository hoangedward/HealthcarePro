const Web3HttpProvider = require('web3-providers-http'); // npm install --save web3-providers-http
const Web3 = require('web3');

const InsuranceCategory = require('./build/InsuranceCategory.json');
const deployed_address = require('./deployed_address.json');

const Accounts = require('./const/Accounts.json');

const DeployAddress = require('./deployed_address.json');

const provider = new Web3HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const deploy = async () => {
	
	var index = 0;
	
	const items = [];
	items[index++] = {
		packId: 1,
		optionIndex: 0,
		itemId: 1,
		itemPercent: 100
	};
	items[index++] = {
		packId: 1,
		optionIndex: 0,
		itemId: 2,
		itemPercent: 80
	};
	items[index++] = {
		packId: 1,
		optionIndex: 0,
		itemId: 3,
		itemPercent: 80
	};
	items[index++] = {
		packId: 1,
		optionIndex: 0,
		itemId: 4,
		itemPercent: 50
	};
	
	items.map( item => {
		
		var myContractInstance = new web3.eth.Contract(InsuranceCategory.interface, DeployAddress.InsuranceCategory);

		myContractInstance.addItem(
			item.packId, item.optionIndex, item.itemId, item.itemPercent, 
			{value: 0, gas: 4000000, from: Accounts['Insurer']}, function(err, result){});
	});
};
deploy();
