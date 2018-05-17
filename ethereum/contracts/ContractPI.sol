pragma solidity 0.4.23;
import "./ContractCP.sol";
import "./InsuranceCategory.sol";

/**
 * This is contract between Insurer and Patient
 */
contract ContractPI {
    
   /**
     * Status of Contract
     * - NEW: when Patient deploy the contract
     */
    enum Status {NEW, INSURER_CONFIRMED, VALID, EXPIRED, REJECTED, CANCELLED}

    enum QueueStatus {PENDING, CONFIRMED, APPROVED}
    
    struct ClaimRequest {
        address requestedContract;
        address patient;
        address clinic;
        QueueStatus status;
        uint amount;
    }
    
    address private _insurer;
    address private _patient;
    
    Status public _status;
    
    string private _desc;
    uint private _contractValue;
    uint private _startDate;
    uint private _endDate;
    uint private _period;
    uint private _packId;
    
    mapping(address => ClaimRequest) private _claimQueue;
    address[] private _claimAddressQueue;
    
    InsuranceCategory private _insuranceCategory;
    
    constructor(address inInusrer, address inPatient, uint inPackId, uint inNumberOfMonths, address inInsurerCategory) public {
        _insuranceCategory = InsuranceCategory(inInsurerCategory);
        require(_insuranceCategory.getOwner() == inInusrer);
        _insurer = inInusrer;
        _patient = inPatient;
		_period = inNumberOfMonths;
		_packId = inPackId;
        _status = Status.NEW;
    }
    
    function patientConfirm(uint inContractValue) external payable minimumAmount(inContractValue) {
        require(msg.sender == _patient);
        uint totalContractValue = _insuranceCategory.calculateContractValue(_packId, _period);
        require(totalContractValue > 0);
        require(inContractValue >= totalContractValue);
        
        _contractValue = msg.value;

        _status = Status.VALID;
        
    }

    function insurerConfirm() external {
        require(msg.sender == _insurer);
        require(_status == Status.NEW);

        _startDate = now;
        _endDate = _startDate + monthToMiliseconds(_period);

        // Transfer money to insurer
        _insurer.transfer(address(this).balance);
        _status = Status.INSURER_CONFIRMED;

        emit ContractSigned(now, msg.sender, _insurer, _packId, _period, _contractValue);
    }

    function insurerReject() external {
        require(msg.sender == _insurer);
        require(_status == Status.NEW);
        // Return money back to Patient
        _patient.transfer(address(this).balance);
        _status = Status.REJECTED;
    }
    
    function patientCancel(address inPatient) external {
        require(inPatient == _patient);
        require(_status == Status.NEW || _status == Status.INSURER_CONFIRMED);
        selfdestruct(inPatient);
    }
		
	function canCancel(address inPatient) external view returns (bool) {
		return inPatient == _patient && (_status == Status.NEW || _status == Status.INSURER_CONFIRMED);
	}
    
    function getInsurer() external view returns(address) {
        return _insurer;
    }
		
	function getPatient() external view returns(address) {
        return _patient;
    }
    
    function requestForClaim(address inContractCP) external returns (uint) {
        require(_status == Status.VALID);
        require(_endDate >= now);
        
        ContractCP cp = ContractCP(inContractCP);
        require(cp.getPatient() == _patient);
        require(_claimQueue[inContractCP].requestedContract == 0);
        
        uint totalAmount = _insuranceCategory.calculateClaimAmount(_packId, _period, cp.getCheckItems(), cp.getCheckPrices());
        if(totalAmount > 0) {
          _claimQueue[inContractCP] = ClaimRequest(inContractCP, _patient, cp.getClinic(), QueueStatus.PENDING, totalAmount);
          
          _claimAddressQueue.push(inContractCP);
          
          emit ClaimRequested(inContractCP, _patient, totalAmount);
        }
        return totalAmount;
        
    }

    function insurerConfirmClaim(address inContractCP) external payable {
        require(msg.sender == _insurer);
        require(_status == Status.VALID);
        ClaimRequest storage request = _claimQueue[inContractCP];
        require(request.requestedContract != 0);
        require(request.status == QueueStatus.PENDING);
        require(msg.value >= request.amount);
        ContractCP cp = ContractCP(inContractCP);
        cp.insurerPay.gas(4000000).value(request.amount)();
        request.status = QueueStatus.CONFIRMED;
    }
    
    function insurerAcceptClaim(address inContractCP) external payable {
        require(msg.sender == _insurer);
        require(_status == Status.VALID);
        ClaimRequest storage request = _claimQueue[inContractCP];
        require(request.requestedContract != 0);
        require(request.status == QueueStatus.CONFIRMED);
        ContractCP cp = ContractCP(inContractCP);
        cp.transferToClinic();

        request.status = QueueStatus.APPROVED;
        
        emit AcceptClaim(inContractCP, _patient, cp.getClinic(), request.amount);
    }
    
    function requestForWithdraw() external payable {
        require(msg.sender == _insurer);
        require(_status == Status.VALID);
        require(_endDate < now);
        _status = Status.EXPIRED;
        msg.sender.transfer(address(this).balance);
    }
    
    function getClaimQueue() external view returns (address[], address[], address[], uint[], QueueStatus[]) {
        // // Test
        // uint length = 2;
        // address[] memory addressList = new address[](length);
        // address[] memory patientList = new address[](length);
        // uint[] memory amountList = new uint[](length);
        // bool[] memory statusList = new bool[](length);
        // addressList[0] = _patient;
        // patientList[0] = _insurer;
        // statusList[0] = false;
        // amountList[0] = 20;
        
        // addressList[1] = _insurer;
        // patientList[1] = _patient;
        // statusList[1] = true;
        // amountList[1] = 200;

        address[] memory addressList = new address[](_claimAddressQueue.length);
        address[] memory patientList = new address[](_claimAddressQueue.length);
        address[] memory clinicList = new address[](_claimAddressQueue.length);
        uint[] memory amountList = new uint[](_claimAddressQueue.length);
        QueueStatus[] memory statusList = new QueueStatus[](_claimAddressQueue.length);
        for(uint i = 0; i < _claimAddressQueue.length; i++) {
            ClaimRequest memory request = _claimQueue[_claimAddressQueue[i]];
            addressList[i] = request.requestedContract;
            patientList[i] = request.patient;
            clinicList[i] = request.clinic;
            statusList[i] = request.status;
            amountList[i] = request.amount;
        }
        
        return (addressList, patientList, clinicList, amountList, statusList);
    }
    
    function monthToMiliseconds(uint inMonth) internal pure returns (uint) {
        uint daysPerMonth = 30;
        uint hoursPerDay = 24;
        uint minsPerHour = 60;
        uint secsPerMin = 60;
        uint milisPerSec = 1000;
        return inMonth * daysPerMonth * hoursPerDay * minsPerHour * secsPerMin * milisPerSec;
    }
    
    
    modifier minimumAmount(uint inWeiAmount) {
        require (msg.value >= inWeiAmount);
        _;
    }
		
    function getSummary() public view returns (
      Status, address, address, uint, uint, uint, uint, uint, uint) {
	    uint totalContractValue = _insuranceCategory.calculateContractValue(_packId, _period);
        return (
            _status,
			_patient,
			_insurer,
			_packId,
			_period,
			totalContractValue,
			_startDate,
			_endDate,
			address(this).balance
        );
    }

    function calculateClaimAmount(address inContractCP) external view returns (uint) {
        ContractCP cp = ContractCP(inContractCP);
        require(cp.getPatient() == _patient);
        
        uint totalAmount = _insuranceCategory.calculateClaimAmount(_packId, _period, cp.getCheckItems(), cp.getCheckPrices());
        return totalAmount;
    }

    event ContractSigned(uint _time, address _patient, address _insurer, uint _packId, uint _period, uint _contractValue);
    
    event ClaimRequested(address, address, uint);
    
    event AcceptClaim(address, address, address, uint);

}