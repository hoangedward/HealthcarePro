import web3 from './web3';
import InsuranceCategory from './build/InsuranceCategory.json';
import deployed_address from './deployed_address.json';

const instance = new web3.eth.Contract(
  JSON.parse(InsuranceCategory.interface),
  deployed_address['InsuranceCategory']
);

export default instance;
