import web3 from './web3';
import ContractPIList from './build/ContractPIList.json';
import deployed_address from './deployed_address.json';

const instance = new web3.eth.Contract(
  JSON.parse(ContractPIList.interface),
  deployed_address['ContractPIList']
);

export default instance;
