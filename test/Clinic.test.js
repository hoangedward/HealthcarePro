const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const ClinicCategoryJSON = require('../ethereum/build/ClinicCategory.json');
const ContractCPListJSON = require('../ethereum/build/ContractCPList.json');
const ContractCPJSON = require('../ethereum/build/ContractCP.json');
const InsuranceCategoryJSON = require('../ethereum/build/InsuranceCategory.json');
const ContractPIListJSON = require('../ethereum/build/ContractPIList.json');
const ContractPIJSON = require('../ethereum/build/ContractPI.json');

describe('End to end test', () => {
  it('Scenario1: Patient can resigter insurer, clinic and auto claim', async () => {
		
    let accounts = await web3.eth.getAccounts();
    
    let accountAdmin = accounts[0];
    let accountPatient = accounts[1];
    let accountClinic = accounts[2];
    let accountInsurer = accounts[3];

    // Step 1.1: Deploy Clinic Category Contract - Clinic
    console.log('1.1: Deploy Clinic Category Contract - Clinic');
    const resultClinicCategory = await new web3.eth.Contract(
      JSON.parse(ClinicCategoryJSON.interface)
    )
      .deploy({ data: ClinicCategoryJSON.bytecode, arguments: [accountClinic] })
      .send({ gas: '4000000', from: accountClinic });
  
    console.log('Contract ClinicCategory deployed to', resultClinicCategory.options.address);
    assert.ok(resultClinicCategory.options.address);

    // Step 1.2: Deploy Clinic List Contract - Admin
    console.log('1.2: Deploy Clinic List Contract - Admin');
    const resultContractCPList = await new web3.eth.Contract(
      JSON.parse(ContractCPListJSON.interface)
    )
      .deploy({ data: ContractCPListJSON.bytecode })
      .send({ gas: '6000000', from: accountAdmin });
  
  
    console.log('Contract ContractCPList deployed to', resultContractCPList.options.address);
    assert.ok(resultContractCPList.options.address);

    // Step 2.1: Deploy Insurer Category Contract - Insurer
    console.log('2.1: Deploy Insurer Category Contract - Insurer');
    const resultInsuranceCategory = await new web3.eth.Contract(
      JSON.parse(InsuranceCategoryJSON.interface)
    )
      .deploy({ data: InsuranceCategoryJSON.bytecode, arguments: [accountInsurer] })
      .send({ gas: '4000000', from: accountInsurer });
  
    console.log('Contract InsuranceCategory deployed to', resultInsuranceCategory.options.address);
    assert.ok(resultInsuranceCategory.options.address);

    let contractInsuranceCategory = new web3.eth.Contract(
      JSON.parse(InsuranceCategoryJSON.interface),
      resultInsuranceCategory.options.address
    );

    assert.equal(20000000000000000000, await contractInsuranceCategory.methods.calculateContractValue(1, 6).call())
    assert.equal(30000000000000000000, await contractInsuranceCategory.methods.calculateContractValue(1, 12).call())
    assert.equal(30000000000000000000, await contractInsuranceCategory.methods.calculateContractValue(2, 6).call())
    assert.equal(40000000000000000000, await contractInsuranceCategory.methods.calculateContractValue(2, 12).call())

    // Step 2.2: Deploy Insurer List Contract - Admin
    console.log('2.2: Deploy Insurer List Contract - Admin');
    const resultContractPIList = await new web3.eth.Contract(
      JSON.parse(ContractPIListJSON.interface)
    )
      .deploy({ data: ContractPIListJSON.bytecode })
      .send({ gas: '4000000', from: accountAdmin });
  
      console.log('Contract ContractPIList deployed to', resultContractPIList.options.address);
    assert.ok(resultContractPIList.options.address);

    // Step 3.1: Patient create a PI contract
    console.log('Step 3.1: Patient create a PI contract');
    let contractPiList = new web3.eth.Contract(
      JSON.parse(ContractPIListJSON.interface),
      resultContractPIList.options.address
    );
    await contractPiList.methods
        .createContract(accountInsurer, accountPatient, 1, 6, resultInsuranceCategory.options.address)
        .send({
          from: accountPatient,
					gas: 4000000
        });

    const deployedPiAddress = await contractPiList.methods.getPatientContracts(accountPatient).call();
    console.log('Contract PI is deployed successfully at ' + deployedPiAddress[0]);

    // Step 3.2: Patient Confirm PI
    const contractPI = new web3.eth.Contract(JSON.parse(ContractPIJSON.interface), deployedPiAddress[0]);
    await contractPI.methods
        .patientConfirm(20000000000000000000)
        .send({
          from: accountPatient,
					gas: 4000000,
					value: 20000000000000000000
        });

    // Step 4.1: Patient create a CP contract
    console.log('Step 4.1: Patient create a CP contract');
    let contractCPList = new web3.eth.Contract(
      JSON.parse(ContractCPListJSON.interface),
      resultContractCPList.options.address
    );
    await contractCPList.methods
                .createContract(
                    accountClinic,
                    accountPatient,
                    resultClinicCategory.options.address,
                    [3])
                .send({
                    from: accountPatient,
                    gas: 4000000
                });

    const deployedCpAddress = await contractCPList.methods.getPatientContracts(accountPatient).call();
    console.log('Contract CP is deployed successfully at ' + deployedCpAddress[0]);

    // Step 4.2: Clinic accept patient
    console.log('Step 4.2: Clinic accept patient');
    var contractCP = new web3.eth.Contract(JSON.parse(ContractCPJSON.interface), deployedCpAddress[0]);

    await contractCP.methods
				.clinicAcceptPatient(deployedPiAddress[0])
				.send({
					from: accountClinic,
					gas: 4000000
        });

    var cpStatus = await contractCP.methods
        .getStatus()
        .call();

    console.log('CP Status = ' + cpStatus);

    const cpTotalFee = await contractCP.methods
        .getTotalFee()
        .call();

    console.log('CP Total Fee = ' + cpTotalFee);

    // Step 5: Clinic reqest for pay: calculateFee
    console.log('Step 5: Clinic reqest for pay: calculateFee');
    const pays = await contractCP.methods
				.calculateFee()
				.send({
					from: accountClinic,
					gas: 4000000
        });

    console.log("Insurer should pay: " + pays);

    // Step 6.1: Patient pay
    console.log('Step 6.1: Patient pay');
    await contractCP.methods
				.patientPay()
				.send({
					from: accountPatient,
          gas: 4000000,
          value: 400000000000000000
        });

    // Step 6.2: Insurer pay
    console.log('Step 6.2: Insurer pay');
    await contractCP.methods
				.insurerPay()
				.send({
					from: accountInsurer,
          gas: 4000000,
          value: 1600000000000000000
        });

    cpStatus = await contractCP.methods
        .getStatus()
        .call();

    console.log('CP Status = ' + cpStatus);
    
    await outBalance('CP balance', deployedCpAddress[0]);

    // Step 7: Patient confirm finish clinic
    console.log('Step 7: Patient confirm finish clinic');
    await contractCP.methods
    .patientConfirm()
    .send({
      from: accountPatient,
      gas: 4000000
    });

    await outBalance('CP balance', deployedCpAddress[0]);

    await outBalance('Clinic', accountClinic);
    await outBalance('Insurer', accountInsurer);
    await outBalance('Patient', accountPatient);

  });

});

async function outBalance(name, account) {
  let balance = await web3.eth.getBalance(account);
  let eth = await toEth(balance);
  console.log('Balance of ' + name + ' = ' + eth);
}

async function outEth(wei) {
  let eth = await toEth(wei);
  console.log(eth);
}

async function toEth(wei) {
  let eth = web3.utils.fromWei(wei, 'ether');
  balance = parseFloat(eth);
  return Math.round(eth) + ' ETH';
}
