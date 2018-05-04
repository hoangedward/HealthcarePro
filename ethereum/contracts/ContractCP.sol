pragma solidity ^0.4.18;
import "./ContractPI.sol";
import "./ClinicCategory.sol";


contract ContractCP {
    
    enum Status {NEW, WAITING_FOR_PAID, CHECKING, DONE, CANCELLED}
    
    address private _clinic;
    address private _patient;
    uint[] private _checkItems;
    uint[] private _checkPrices;
    Status public _status;
    string private _desc;
    uint private _totalFee;
    
    address private _contractPI;
    bool private _patientPaid;
    uint private _patientPaidAmount;
    bool private _insurerPaid;
    uint private _insurerPaidAmount;
    
    ClinicCategory private _contractClinicCategory;
    
    function ContractCP(address inClinic, address inPatient, address inClinicCategory, uint[] inCheckItems) {
        require(inCheckItems.length > 0);
        _contractClinicCategory = ClinicCategory(inClinicCategory);
        require(_contractClinicCategory.getOwner() == inClinic);
        _clinic = inClinic;
        _patient = inPatient;
        _status = Status.NEW;
        _checkItems = inCheckItems;
        
        
        _totalFee = _contractClinicCategory.calFee(inCheckItems);
    }
    
    function clinicAcceptPatient(address inContractPI) {
        require(msg.sender == _clinic);
        require(_status == Status.NEW);
        _contractPI = inContractPI;
        _status = Status.WAITING_FOR_PAID;
    }
    
    function calculateFee() returns (uint, uint) {
        require(msg.sender == _clinic);
        require(_status == Status.WAITING_FOR_PAID);
        ContractPI pi = ContractPI(_contractPI);
        uint[] pays;
        pays[0] = pi.requestForClaim(this);
        pays[1] = _totalFee - pays[0];
        
        InformTotalFee(pays[0], pays[1]);
        
        return (pays[0], pays[1]);
    }
    
    function patientPay() payable {
        require(msg.sender == _patient);
        require(_status == Status.WAITING_FOR_PAID);
        require(_patientPaidAmount > 0);
        require(_patientPaid == false);
        require(msg.value >= _patientPaidAmount);
        _patientPaid = true;
        PatientPaid(_patientPaidAmount);
        
        checkForPay();
    }
    
    function insurerPay() payable {
        require(_status == Status.WAITING_FOR_PAID);
        require(_insurerPaidAmount > 0);
        require(_insurerPaid == false);
        ContractPI pi = ContractPI(_contractPI);
        require(msg.sender == pi.getInsurer());
        require(msg.value >= _insurerPaidAmount);
        _insurerPaid = true;
        InsurerPaid(_patientPaidAmount);
        
        checkForPay();
    }
    
    function checkForPay() {
        require(_status == Status.WAITING_FOR_PAID);
        require(_insurerPaidAmount == 0 || _insurerPaid);
        require(_patientPaidAmount == 0 || _patientPaid);
        _status = Status.CHECKING;
        ReadyToCheck();
    }
    
    function patientConfirm() payable {
        require(msg.sender == _patient);
        require(_status == Status.CHECKING);
        _clinic.transfer(this.balance);
        _status = Status.DONE;
    }
    
    function patientCancel() {
        require(msg.sender == _patient);
        require(_status == Status.NEW);
        _status = Status.CANCELLED;
        suicide(msg.sender);
    }
    
    function getPatient() view external returns (address) {
        return _patient;
    }
    
    function getCheckItem(uint inIndex) view returns (uint) {
        return _checkItems[inIndex];
    }
    
    function getCheckPrice(uint inIndex) view returns (uint) {
        return _checkPrices[inIndex];
    }
    
    function getItemCount() view returns (uint) {
        return _checkItems.length;
    }
    
    function receive(uint inAmount) payable minimumAmount(inAmount) {
        
    }
    
    modifier minimumAmount(uint inEtherAmount) {
        require (msg.value >= inEtherAmount * 1 ether);
        _;
    }

    function getSummary() public view returns (Status, address, address, uint[], uint, uint) {
        uint totalContractValue = _contractClinicCategory.calFee(_checkItems);
        return (
            _status,
            _patient,
            _clinic,
            _checkItems,
            totalContractValue,
            this.balance
        );
    }

    event InformTotalFee(uint, uint);
    
    event PatientPaid(uint);
    
    event InsurerPaid(uint);
    
    event ReadyToCheck();
    
}