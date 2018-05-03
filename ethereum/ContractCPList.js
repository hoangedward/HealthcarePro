import web3 from './web3';
import ContractCPList from './build/ContractCPList.json';
import deployed_address from './deployed_address.json';

const instance = new web3.eth.Contract(
  JSON.parse(ContractCPList.interface),
  deployed_address['ContractCPList']
);

export default instance;
