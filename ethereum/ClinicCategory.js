import web3 from './web3';
import ClinicCategory from './build/ClinicCategory.json';
import deployed_address from './deployed_address.json';

const instance = new web3.eth.Contract(
  JSON.parse(ClinicCategory.interface),
  deployed_address['ClinicCategory']
);

export default instance;
