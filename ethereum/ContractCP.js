import web3 from './web3';
import ContractCP from './build/ContractCP.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(ContractCP.interface), address);
};
