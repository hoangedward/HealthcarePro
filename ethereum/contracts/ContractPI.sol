pragma solidity ^0.4.18;
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
    enum Status {NEW, VALID, EXPIRED, CANCELLED}
    
    struct ClaimRequest {
        address requestedContract;
        address patient;
        bool paid;
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
    
    mapping(address => ClaimRequest) _claimQueue;
    
    InsuranceCategory private _insuranceCategory;
    
    function ContractPI(address inInusrer, address inPatient, uint inPackId, uint inNumberOfMonths, address inInsurerCategory) {
        _insuranceCategory = InsuranceCategory(inInsurerCategory);
        require(_insuranceCategory.getOwner() == inInusrer);
        _insurer = inInusrer;
        _patient = inPatient;
				_period = inNumberOfMonths;
				_packId = inPackId;
        _status = Status.NEW;
    }
    
    function patientConfirm(uint inStartDate, uint inContractValue) payable minimumAmount(inContractValue) {
        require(msg.sender == _patient);
        uint totalContractValue = _insuranceCategory.calculateContractValue(_packId, _period);
        require(totalContractValue > 0);
        require(msg.value >= inContractValue);
        require(inContractValue >= totalContractValue);
        require(inStartDate >= now);
        
        _contractValue = msg.value;
        _startDate = inStartDate;
        _endDate = inStartDate + monthToMiliseconds(_period);
        _status = Status.VALID;
        
        ContractSigned(msg.sender, _packId, _contractValue);
        
    }
    
    function patientCancel() {
        require(msg.sender == _patient);
        require(_status == Status.NEW);
        suicide(msg.sender);
    }
    
    function getInsurer() returns(address) {
        return _insurer;
    }
    
    function requestForClaim(address inContractCP) returns (uint) {
        require(_status == Status.VALID);
        require(_endDate >= now);
        
        ContractCP cp = ContractCP(inContractCP);
        require(cp.getPatient() == _patient);
        require(_claimQueue[inContractCP].requestedContract == 0);
        
        uint itemCount = cp.getItemCount();
        uint[] checkItems;
        uint[] checkPrices;
        for(uint i = 0; i < itemCount; i++) {
            checkItems[i] = cp.getCheckItem(i);
            checkPrices[i] = cp.getCheckPrice(i);
        }
        
        uint totalAmount = _insuranceCategory.calculateClaimAmount(_packId, _period, checkItems, checkPrices);
        if(totalAmount > 0) {
          _claimQueue[inContractCP] = ClaimRequest(inContractCP, _patient, false, totalAmount);
          ClaimRequested(inContractCP, _patient, totalAmount);
          return 0;
        }
        return 1;
        
    }
    
    function insurerAcceptClaim(address inContractCP) payable {
        require(msg.sender == _insurer);
        require(_status == Status.VALID);
        ClaimRequest request = _claimQueue[inContractCP];
        require(request.requestedContract != 0);
        require(request.paid == false);
        require(msg.value >= request.amount);
        ContractCP cp = ContractCP(inContractCP);
        cp.receive.gas(300000).value(request.amount)(request.amount);
        request.paid = true;
        
        AcceptClaim(inContractCP, _patient, request.amount);
    }
    
    function requestForWithdraw() payable {
        require(msg.sender == _insurer);
        require(_status == Status.VALID);
        require(_endDate < now);
        _status = Status.EXPIRED;
        msg.sender.transfer(this.balance);
    }
    
    function monthToMiliseconds(uint inMonth) internal returns (uint) {
        uint daysPerMonth = 30;
        uint hoursPerDay = 24;
        uint minsPerHour = 60;
        uint secsPerMin = 60;
        uint milisPerSec = 1000;
        return inMonth * daysPerMonth * hoursPerDay * minsPerHour * secsPerMin * milisPerSec;
    }
    
    
    modifier minimumAmount(uint inEtherAmount) {
        require (msg.value >= inEtherAmount * 1 ether);
        _;
    }
		
		function getSummary() public view returns (
      Status, address, address, uint, uint, uint, uint, uint
      ) {
				uint totalContractValue = _insuranceCategory.calculateContractValue(_packId, _period);
        return (
          _status,
					_patient,
					_insurer,
					_packId,
					_period,
					totalContractValue,
					_startDate,
					_endDate
        );
    }
    
    event ContractSigned(address, uint, uint);
    
    event ClaimRequested(address, address, uint);
    
    event AcceptClaim(address, address, uint);

}