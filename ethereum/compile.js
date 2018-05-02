const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const pathContractCP = path.resolve(__dirname, 'contracts', 'ContractCP.sol');
const pathContractCPList = path.resolve(__dirname, 'contracts', 'ContractCPList.sol');
const pathContractPI = path.resolve(__dirname, 'contracts', 'ContractPI.sol');
const pathContractPIList = path.resolve(__dirname, 'contracts', 'ContractPIList.sol');
const pathClinicCategory = path.resolve(__dirname, 'contracts', 'ClinicCategory.sol');
const pathInsuranceCategory = path.resolve(__dirname, 'contracts', 'InsuranceCategory.sol');

var input = {
    'ContractCP.sol': fs.readFileSync(pathContractCP, 'utf8'),
    'ContractCPList.sol': fs.readFileSync(pathContractCPList, 'utf8'),
    'ContractPI.sol': fs.readFileSync(pathContractPI, 'utf8'),
    'ContractPIList.sol': fs.readFileSync(pathContractPIList, 'utf8'),
		'ClinicCategory.sol': fs.readFileSync(pathClinicCategory, 'utf8'),
		'InsuranceCategory.sol': fs.readFileSync(pathInsuranceCategory, 'utf8')
};
const output = solc.compile({sources: input}, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.substring(0, contract.indexOf(':')) + '.json'),
    output[contract]
  );
}
