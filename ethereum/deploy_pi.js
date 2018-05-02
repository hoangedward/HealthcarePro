const Web3HttpProvider = require('web3-providers-http'); // npm install --save web3-providers-http
const Web3 = require('web3');
const InsuranceCategory = require('./build/InsuranceCategory.json');
const ContractPIList = require('./build/ContractPIList.json');

const provider = new Web3HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  // InsuranceCategory
  console.log('Attempting to deploy InsuranceCategory from account', accounts[3]);

  const resultInsuranceCategory = await new web3.eth.Contract(
    JSON.parse(InsuranceCategory.interface)
  )
    .deploy({ data: InsuranceCategory.bytecode, arguments: [accounts[3]] })
    .send({ gas: '4000000', from: accounts[3] });

  console.log('Contract InsuranceCategory deployed to', resultInsuranceCategory.options.address);
  
  // ContractPIList
  console.log('Attempting to deploy ContractPIList from account', accounts[0]);

  const resultContractPIList = await new web3.eth.Contract(
    JSON.parse(ContractPIList.interface)
  )
    .deploy({ data: ContractPIList.bytecode })
    .send({ gas: '4000000', from: accounts[0] });

  console.log('Contract ContractPIList deployed to', resultContractPIList.options.address);
};
deploy();
