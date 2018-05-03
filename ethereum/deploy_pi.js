const Web3HttpProvider = require('web3-providers-http'); // npm install --save web3-providers-http
const Web3 = require('web3');
const InsuranceCategory = require('./build/InsuranceCategory.json');
const ContractPIList = require('./build/ContractPIList.json');
const Accounts = require('./const/Accounts.json');

const provider = new Web3HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

const deployed_address = require('./deployed_address.js');

const deploy = async () => {

  // InsuranceCategory
  console.log('Attempting to deploy InsuranceCategory from account', Accounts['Insurer']);

  const resultInsuranceCategory = await new web3.eth.Contract(
    JSON.parse(InsuranceCategory.interface)
  )
    .deploy({ data: InsuranceCategory.bytecode, arguments: [Accounts['Insurer']] })
    .send({ gas: '4000000', from: Accounts['Insurer'] });

  console.log('Contract InsuranceCategory deployed to', resultInsuranceCategory.options.address);
  
  // ContractPIList
  console.log('Attempting to deploy ContractPIList from account', Accounts['Admin']);

  const resultContractPIList = await new web3.eth.Contract(
    JSON.parse(ContractPIList.interface)
  )
    .deploy({ data: ContractPIList.bytecode })
    .send({ gas: '4000000', from: Accounts['Admin'] });


  console.log('Contract ContractPIList deployed to', resultContractPIList.options.address);

  // Write to json file of deployed addresses
  writeAddressJson("InsuranceCategory", resultInsuranceCategory.options.address);
  writeAddressJson("ContractPIList", resultContractPIList.options.address);
};
deploy();
