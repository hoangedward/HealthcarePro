const Web3HttpProvider = require('web3-providers-http'); // npm install --save web3-providers-http
const Web3 = require('web3');
const ClinicCategory = require('./build/ClinicCategory.json');
const ContractCPList = require('./build/ContractCPList.json');
const Accounts = require('./const/Accounts.json');
const {ganache} = require('./ganache.js');

const provider = new Web3HttpProvider(ganache.host);
const web3 = new Web3(provider);

const deployed_address = require('./deployed_address.js');

const deploy = async () => {

  // ClinicCategory
  console.log('Attempting to deploy ClinicCategory from account', Accounts['Clinic']);

  const resultClinicCategory = await new web3.eth.Contract(
    JSON.parse(ClinicCategory.interface)
  )
    .deploy({ data: ClinicCategory.bytecode, arguments: [Accounts['Clinic']] })
    .send({ gas: '4000000', from: Accounts['Clinic'] });

  console.log('Contract ClinicCategory deployed to', resultClinicCategory.options.address);
  
  // ContractCPList
  console.log('Attempting to deploy ContractCPList from account', Accounts['Admin']);

  const resultContractCPList = await new web3.eth.Contract(
    JSON.parse(ContractCPList.interface)
  )
    .deploy({ data: ContractCPList.bytecode })
    .send({ gas: '6000000', from: Accounts['Admin'] });


  console.log('Contract ContractCPList deployed to', resultContractCPList.options.address);

  // Write to json file of deployed addresses
  writeAddressJson("ClinicCategory", resultClinicCategory.options.address);
  writeAddressJson("ContractCPList", resultContractCPList.options.address);
};
deploy();
