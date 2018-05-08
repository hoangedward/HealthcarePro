pragma solidity ^0.4.18;
import "./ContractPI.sol";

/**
 * This contract manages all contracts of Patient & Insurer
 */
contract ContractPIList {
    
    mapping(address => address[]) private _patientContractList;
    mapping(address => address[]) private _insurerContractList;
    
    /**
     * Create a ContractPI and save it to the list of contracts of Patient;
     * @param inInsurer address of Insurer account
     * @param inPatient address of Patient account
     * @param inInsurerCategory address of Insurer Category contract
     */
    function createContract(address inInsurer, address inPatient, uint inPackId, uint inNumberOfMonths, address inInsurerCategory) {
        require(msg.sender == inPatient);
        address pi = new ContractPI(inInsurer, inPatient, inPackId, inNumberOfMonths, inInsurerCategory);
        // Add to Patient contracts list
        address[] currentContractListOfPatient = _patientContractList[inPatient];
        currentContractListOfPatient.push(pi);
        // Add to Insurer contracts list
        address[] currentContractListOfInsurer = _insurerContractList[inInsurer];
        currentContractListOfInsurer.push(pi);
    }
    
    /**
     * Returns list of contracts of a patient
     * @param inPatient address of patient
     * @return address[] list of contract addresses
     */
    function getPatientContracts(address inPatient) returns (address[]) {
        return _patientContractList[inPatient];
    }
    
    /**
     * Returns list of contracts of a insurer
     * @param inInsurer address of insurer
     * @return address[] list of contract addresses
     */
    function getInsurerContracts(address inInsurer) returns (address[]) {
        return _insurerContractList[inInsurer];
    }
		
		function patientCancel(address inContract) public returns (uint) {
			address[] contractList = _patientContractList[msg.sender];
			for(uint i = 0; i < contractList.length; i++) {
				if(contractList[i] == inContract) {
					ContractPI pi = ContractPI(inContract);
					if(pi.canCancel(msg.sender) == false) {
						return 1;
					}
					address patient = pi.getPatient();
					address insurer = pi.getInsurer();
					removeContract(insurer, patient, i);
					pi.patientCancel(msg.sender);
					return 0;
				}
			}
			return 1;
		}
		
		function removeContract(address inInsurer, address inPatient, uint inIndex) internal {
			address[] currentContractListOfPatient = _patientContractList[inPatient];
			currentContractListOfPatient[inIndex] = currentContractListOfPatient[currentContractListOfPatient.length - 1];
			delete currentContractListOfPatient[currentContractListOfPatient.length - 1];
			currentContractListOfPatient.length--;
			
			address[] currentContractListOfInsurer = _insurerContractList[inInsurer];
			currentContractListOfInsurer[inIndex] = currentContractListOfInsurer[currentContractListOfInsurer.length - 1];
			delete currentContractListOfInsurer[currentContractListOfInsurer.length - 1];
			currentContractListOfInsurer.length--;
		}
    
}