import web3 from './web3';
import ContractPIList from './build/ContractPIList.json';

const instance = new web3.eth.Contract(
  JSON.parse(ContractPIList.interface),
  '0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0'
);

export default instance;
