import web3 from './web3';
import ContractPI from './build/ContractPI.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(ContractPI.interface), address);
};
