import web3 from './web3';
import InsuranceCategory from './build/InsuranceCategory.json';

const instance = new web3.eth.Contract(
  JSON.parse(InsuranceCategory.interface),
  '0xCA7740C40E82f945D4e48b9Cf2475c2674B2813D'
);

export default instance;
