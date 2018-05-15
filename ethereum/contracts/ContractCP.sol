pragma solidity 0.4.23;
import "./ContractPI.sol";
import "./ClinicCategory.sol";


contract ContractCP {
    
    enum Status {NEW, WAITING_FOR_PAID, CHECKING, DONE, CANCELLED}
    
    address private _clinic;
    address private _patient;
    uint[] private _checkItems;
    Status public _status;
    string private _desc;
    uint private _totalFee;
    
    address private _contractPI;
    bool private _patientPaid;
    uint private _patientPaidAmount;
    bool private _insurerPaid;
    uint private _insurerPaidAmount;

    // For simply, I just want to store 1 document link
    // Ethereum now is not support return string[]
    string private _documentLink;
    
    ClinicCategory private _contractClinicCategory;
    
    constructor(address inClinic, address inPatient, address inClinicCategory, uint[] inCheckItems, address inContractPI) public {
        require(inCheckItems.length > 0);
        _contractClinicCategory = ClinicCategory(inClinicCategory);
        require(_contractClinicCategory.getOwner() == inClinic);
        _clinic = inClinic;
        _patient = inPatient;
        _status = Status.NEW;
        _checkItems = inCheckItems;
        _contractPI = inContractPI;
        
        _totalFee = _contractClinicCategory.calFee(inCheckItems);
    }

    function getStatus() external view returns (Status) {
        return _status;
    }

    function getTotalFee() external view returns (uint) {
        return _totalFee;
    }
    
    function clinicAcceptPatient() external {
        require(msg.sender == _clinic);
        require(_status == Status.NEW);
        calculateFee();
        _status = Status.WAITING_FOR_PAID;
    }
    
    function calculateFee() internal {
        require(msg.sender == _clinic);
        require(_status == Status.NEW);
        if(_contractPI != 0) {
            ContractPI pi = ContractPI(_contractPI);
            _insurerPaidAmount = pi.requestForClaim(this);
        }
        else {
            // No insurance
            _insurerPaid = true;
        }
        _patientPaidAmount = _totalFee - _insurerPaidAmount;

        emit InformTotalFee(_insurerPaidAmount, _patientPaidAmount);
    }

    function getPayInformation() external view returns (uint, uint) {
        return (_insurerPaidAmount, _patientPaidAmount);
    }
    
    function patientPay() external payable {
        require(msg.sender == _patient);
        require(_status == Status.WAITING_FOR_PAID);
        require(_patientPaidAmount > 0);
        require(_patientPaid == false);
        require(msg.value >= _patientPaidAmount);
        _patientPaid = true;

        emit PatientPaid(_patientPaidAmount);
        
        checkForPay();
    }
    
    function insurerPay() external payable {
        require(_status == Status.WAITING_FOR_PAID);
        require(_insurerPaidAmount > 0);
        require(_insurerPaid == false);
        require(msg.sender == _contractPI);
        require(msg.value >= _insurerPaidAmount);
        _insurerPaid = true;
        emit InsurerPaid(_patientPaidAmount);
        
        checkForPay();
    }
    
    function checkForPay() internal {
        require(_status == Status.WAITING_FOR_PAID);
        if(_insurerPaid && _patientPaid) {
            _status = Status.CHECKING;
        }
        emit ReadyToCheck();
    }
    
    function patientConfirm() external payable {
        require(msg.sender == _patient);
        require(_status == Status.CHECKING);
        _clinic.transfer(address(this).balance);
        _status = Status.DONE;
    }
    
    function patientCancel(address inPatient) external {
        require(inPatient == _patient);
        require(_status == Status.NEW);
        _status = Status.CANCELLED;
        selfdestruct(msg.sender);
    }

    function canCancel(address inPatient) external view returns (bool) {
		return inPatient == _patient && _status == Status.NEW;
	}
    
    function getPatient() external view returns (address) {
        return _patient;
    }

    function getClinic() external view returns (address) {
        return _clinic;
    }
    
    function getCheckItems() external view returns (uint[]) {
        return _checkItems;
    }
    
    function getCheckPrices() external view returns (uint[]) {
        return _contractClinicCategory.getCheckPrices(_checkItems);
    }
    
    function receive(uint inAmount) external payable minimumAmount(inAmount) {
        
    }
    
    modifier minimumAmount(uint inWeiAmount) {
        require (msg.value >= inWeiAmount);
        _;
    }

    function setDocument(string inDocumentLink) external {
        _documentLink = inDocumentLink;
    }

    function getDocument() external view returns (string) {
        return _documentLink;
    }

    function getSummary() external view returns (Status, address, address, uint[], uint, uint, string, address, uint, uint) {
        uint totalContractValue = _contractClinicCategory.calFee(_checkItems);
        return (
            _status,
            _patient,
            _clinic,
            _checkItems,
            totalContractValue,
            address(this).balance,
            _documentLink,
            _contractPI,
            _patientPaidAmount,
            _insurerPaidAmount
        );
    }

    event InformTotalFee(uint, uint);
    
    event PatientPaid(uint);
    
    event InsurerPaid(uint);
    
    event ReadyToCheck();
    
}