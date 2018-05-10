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

    // Default gas for function call
    const DEF_GAS = 4000000;

    // By default, all Ganache accounts are unlocked and ready for payment without confirmation from user
    let accounts = await web3.eth.getAccounts();

    // Default account for each user
    let accountAdmin = accounts[0];
    let accountPatient = accounts[1];
    let accountClinic = accounts[2];
    let accountInsurer = accounts[3];


    // *****************************************************************
    // Step 1.1: Deploy Clinic Category Contract - Clinic
    // *****************************************************************
    console.log('1.1: Deploy Clinic Category Contract - Clinic');
    const resultClinicCategory = await new web3.eth.Contract(
      JSON.parse(ClinicCategoryJSON.interface)
    )
      .deploy({ data: ClinicCategoryJSON.bytecode, arguments: [accountClinic] })
      .send({ gas: DEF_GAS, from: accountClinic });

    console.log('Contract ClinicCategory deployed to', resultClinicCategory.options.address);
    assert.ok(resultClinicCategory.options.address);

    // calFee
    // 1+2+2+3+10+5=23
    assert.equal(web3.utils.toWei('23', 'ether'),
      await resultClinicCategory.methods.calFee([1, 2, 3, 4, 5, 6]).call());

    // getCheckPrices
    let checkPrices = await resultClinicCategory.methods.getCheckPrices([1, 2, 3, 4, 5, 6]).call();
    assert.equal(toWei('1', 'ether'), checkPrices[0]);
    assert.equal(toWei('2', 'ether'), checkPrices[1]);
    assert.equal(toWei('2', 'ether'), checkPrices[2]);
    assert.equal(toWei('3', 'ether'), checkPrices[3]);
    assert.equal(toWei('10', 'ether'), checkPrices[4]);
    assert.equal(toWei('5', 'ether'), checkPrices[5]);

    // *****************************************************************
    // Step 1.2: Deploy Clinic List Contract - Admin
    // *****************************************************************
    console.log('1.2: Deploy Clinic List Contract - Admin');
    const contractCPList = await new web3.eth.Contract(
      JSON.parse(ContractCPListJSON.interface)
    )
      .deploy({ data: ContractCPListJSON.bytecode })
      .send({ gas: DEF_GAS, from: accountAdmin });

    console.log('Contract ContractCPList deployed to', contractCPList.options.address);
    assert.ok(contractCPList.options.address);


    // *****************************************************************
    // Step 2.1: Deploy Insurer Category Contract - Insurer
    // *****************************************************************
    console.log('2.1: Deploy Insurer Category Contract - Insurer');
    const resultInsuranceCategory = await new web3.eth.Contract(
      JSON.parse(InsuranceCategoryJSON.interface)
    )
      .deploy({ data: InsuranceCategoryJSON.bytecode, arguments: [accountInsurer] })
      .send({ gas: DEF_GAS, from: accountInsurer });

    console.log('Contract InsuranceCategory deployed to', resultInsuranceCategory.options.address);
    assert.ok(resultInsuranceCategory.options.address);

    // calculateContractValue
    assert.equal(toWei('20', 'ether'),
      await resultInsuranceCategory.methods.calculateContractValue(1, 6).call())
    assert.equal(toWei('30', 'ether'),
      await resultInsuranceCategory.methods.calculateContractValue(1, 12).call())
    assert.equal(toWei('30', 'ether'),
      await resultInsuranceCategory.methods.calculateContractValue(2, 6).call())
    assert.equal(toWei('40', 'ether'),
      await resultInsuranceCategory.methods.calculateContractValue(2, 12).call())

    // calculateClaimAmount
    assert.equal(700,
      await resultInsuranceCategory.methods.calculateClaimAmount(1, 6, [1, 2, 3, 4], [100, 200, 300, 400]).call());
    assert.equal(520,
      await resultInsuranceCategory.methods.calculateClaimAmount(1, 12, [2, 3, 4], [100, 300, 400]).call());
    assert.equal(800,
      await resultInsuranceCategory.methods.calculateClaimAmount(2, 6, [1, 2, 3], [100, 300, 400]).call());
    assert.equal(1860,
      await resultInsuranceCategory.methods.calculateClaimAmount(2, 12, [1, 2, 3, 4, 5, 6], [100, 300, 400, 200, 500, 1000]).call());

    // *****************************************************************
    // Step 2.2: Deploy Insurer List Contract - Admin
    // *****************************************************************
    console.log('2.2: Deploy Insurer List Contract - Admin');
    const contractPiList = await new web3.eth.Contract(
      JSON.parse(ContractPIListJSON.interface)
    )
      .deploy({ data: ContractPIListJSON.bytecode })
      .send({ gas: DEF_GAS, from: accountAdmin });

    console.log('Contract ContractPIList deployed to', contractPiList.options.address);
    assert.ok(contractPiList.options.address);


    // *****************************************************************
    // Step 3.1: Patient create a PI contract
    // *****************************************************************
    console.log('Step 3.1: Patient create a PI contract');
    await contractPiList.methods
      .createContract(accountInsurer, accountPatient, 1, 6, resultInsuranceCategory.options.address)
      .send({
        from: accountPatient,
        gas: DEF_GAS
      });

    const deployedPiAddress = await contractPiList.methods.getPatientContracts(accountPatient).call();
    console.log('Contract PI is deployed successfully at ' + deployedPiAddress[0]);


    // *****************************************************************
    // Step 3.2: Patient Confirm PI
    // *****************************************************************
    const contractPI = new web3.eth.Contract(JSON.parse(ContractPIJSON.interface), deployedPiAddress[0]);
    await contractPI.methods
      .patientConfirm(toWei('20', 'ether'))
      .send({
        from: accountPatient,
        gas: DEF_GAS,
        value: toWei('20', 'ether')
      });

    await outBalance('Patient', accountPatient);
    await outBalance('ContractPI', deployedPiAddress[0]);

    assert.equal('80.0', fromWeiRound(await web3.eth.getBalance(accountPatient), 'ether'));
    assert.equal('20.0', fromWeiRound(await web3.eth.getBalance(deployedPiAddress[0]), 'ether'));


    // *****************************************************************
    // Step 4.1: Patient create a CP contract
    // *****************************************************************
    console.log('Step 4.1: Patient create a CP contract');
    await contractCPList.methods
      .createContract(
        accountClinic,
        accountPatient,
        resultClinicCategory.options.address,
        [3])
      .send({
        from: accountPatient,
        gas: DEF_GAS
      });

    const deployedCpAddress = await contractCPList.methods.getPatientContracts(accountPatient).call();
    console.log('Contract CP is deployed successfully at ' + deployedCpAddress[0]);


    // *****************************************************************
    // Step 4.2: Clinic accept patient
    // *****************************************************************
    console.log('Step 4.2: Clinic accept patient');
    var contractCP = new web3.eth.Contract(JSON.parse(ContractCPJSON.interface), deployedCpAddress[0]);

    // NEW
    assert.equal(0, await contractCP.methods.getStatus().call());

    await contractCP.methods
      .clinicAcceptPatient(deployedPiAddress[0])
      .send({
        from: accountClinic,
        gas: DEF_GAS
      });

    // WAITING_FOR_PAID
    assert.equal(1, await contractCP.methods.getStatus().call());

    assert.equal(toWei('2', 'ether'), await contractCP.methods.getTotalFee().call());


    // *****************************************************************
    // Step 5: Clinic reqest for pay: calculateFee
    // *****************************************************************
    console.log('Step 5: Clinic reqest for pay: calculateFee');
    await contractCP.methods
      .calculateFee()
      .send({
        from: accountClinic,
        gas: DEF_GAS
      });

    const pays = await contractCP.methods
      .getPayInformation()
      .call();

    console.log("Insurer should pay: " + toEth(pays[0]) + '. Patient should pay: ' + toEth(pays[1]));
    assert.equal(toWei('1.6', 'ether'), pays[0]);
    assert.equal(toWei('0.4', 'ether'), pays[1]);


    // *****************************************************************
    // Step 6.1: Patient pay
    // *****************************************************************
    console.log('Step 6.1: Patient pay');
    await contractCP.methods
      .patientPay()
      .send({
        from: accountPatient,
        gas: DEF_GAS,
        value: toWei('0.4', 'ether')
      });

    assert.equal(toWei('0.4', 'ether'), await web3.eth.getBalance(deployedCpAddress[0]));

    // Still WAITING_FOR_PAID
    assert.equal(1, await contractCP.methods.getStatus().call());

    // *****************************************************************
    // Step 6.2: Insurer pay
    // *****************************************************************
    console.log('Step 6.2: Insurer pay');
    await contractCP.methods
      .insurerPay()
      .send({
        from: accountInsurer,
        gas: DEF_GAS,
        value: toWei('1.6', 'ether')
      });

    // CHECKING
    assert.equal(2, await contractCP.methods.getStatus().call());

    assert.equal(toWei('2', 'ether'), await web3.eth.getBalance(deployedCpAddress[0]));

    await outBalance('ContractCP', deployedCpAddress[0]);


    // *****************************************************************
    // Step 7: Patient confirm finish clinic
    // *****************************************************************
    console.log('Step 7: Patient confirm finish clinic');
    await contractCP.methods
      .patientConfirm()
      .send({
        from: accountPatient,
        gas: DEF_GAS
      });

    assert.equal(toWei('0', 'ether'), await web3.eth.getBalance(deployedCpAddress[0]));
    assert.equal('102.0', fromWeiRound(await web3.eth.getBalance(accountClinic), 'ether'));
    assert.equal('98.4', fromWeiRound(await web3.eth.getBalance(accountInsurer), 'ether'));
    assert.equal('79.6', fromWeiRound(await web3.eth.getBalance(accountPatient), 'ether'));

    await outBalance('ContractCP', deployedCpAddress[0]);
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

function toEth(wei) {
  let eth = web3.utils.fromWei(wei, 'ether');
  balance = parseFloat(eth).toFixed(1);
  return balance + ' ETH';
}

function println(s) {
  console.log(s);
  console.log('\n');
}

function toWei(ether, uint) {
  return web3.utils.toWei(ether, uint)
}

function fromWeiRound(wei, uint) {
  let eth = web3.utils.fromWei(wei, uint);
  return parseFloat(eth).toFixed(1);
}
