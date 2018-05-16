pragma solidity 0.4.23;
import "./ContractCP.sol";

/**
 * This contract manages all contracts of Patient & Clinic
 */
contract ContractCPList {
    
    mapping(address => address[]) private _patientContractList;
    mapping(address => address[]) private _clinicContractList;

    event ContractEvent(
        address addressCP,
        bool isAdd
    );

    function createContract(address inClinic, address inPatient, address inClinicCategory, uint[] inCheckItems, address inContractcp) external {
        require(msg.sender == inPatient);

        address cp = new ContractCP(inClinic, inPatient, inClinicCategory, inCheckItems, inContractcp);
        // Add to Patient contracts list
        address[] storage currentContractListOfPatient = _patientContractList[inPatient];
        currentContractListOfPatient.push(cp);
        // Add to Clinic contracts list
        address[] storage currentContractListOfClinic = _clinicContractList[inClinic];
        currentContractListOfClinic.push(cp);

        // Notify adding new ContractCP
        emit ContractEvent(cp, true);
    }

    function getPatientContracts(address inPatient) external view returns (address[]) {
        return _patientContractList[inPatient];
    }

    function getClinicContracts(address inClinic) external view returns (address[]) {
        return _clinicContractList[inClinic];
    }

    function patientCancel(address inContract) external returns (uint) {
		address[] storage contractList = _patientContractList[msg.sender];
		for(uint i = 0; i < contractList.length; i++) {
			if(contractList[i] == inContract) {
				ContractCP cp = ContractCP(inContract);
				if(cp.canCancel(msg.sender) == false) {
                    // Failed
					return 1;
				}
				address patient = cp.getPatient();
				address clinic = cp.getClinic();
				removeContract(clinic, patient, i);
				cp.patientCancel(msg.sender);

                // Notify removing the existing contract
                emit ContractEvent(address(cp), false);

                // Success
				return 0;
			}
		}
		return 1;
	}
		
	function removeContract(address inClinic, address inPatient, uint inIndex) internal {
		address[] storage currentContractListOfPatient = _patientContractList[inPatient];
		currentContractListOfPatient[inIndex] = currentContractListOfPatient[currentContractListOfPatient.length - 1];
		delete currentContractListOfPatient[currentContractListOfPatient.length - 1];
		currentContractListOfPatient.length--;
		
		address[] storage currentContractListOfClinic = _clinicContractList[inClinic];
		currentContractListOfClinic[inIndex] = currentContractListOfClinic[currentContractListOfClinic.length - 1];
		delete currentContractListOfClinic[currentContractListOfClinic.length - 1];
		currentContractListOfClinic.length--;
	}
}