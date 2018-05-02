pragma solidity ^0.4.18;
import "./ContractCP.sol";

/**
 * This contract manages all contracts of Patient & Clinic
 */
contract ContractCPList {
    
    mapping(address => address[]) private _patientContractList;
    mapping(address => address[]) private _clinicContractList;
    
    // Duration of implementation, we need to detect when the method is called
    event CreateContractEvent(string message);

    /**
     * Create a ContractCP and save it to the list of contracts of Patient;
     * @param inClinic address of Clinic account
     * @param inPatient address of Patient account
     * @param inClinicCategory address of Clinic Cateogry Contract
     * @param inCheckItems list of items that Patient want to check
     */
    function createContract(address inClinic, address inPatient, address inClinicCategory, uint[] inCheckItems) {
        CreateContractEvent("1");
        require(msg.sender == inPatient);

        CreateContractEvent("2");
        address pi = new ContractCP(inClinic, inPatient, inClinicCategory, inCheckItems);
        // Add to Patient contracts list
        CreateContractEvent("3");
        address[] currentContractListOfPatient = _patientContractList[inPatient];
        CreateContractEvent("4");
        currentContractListOfPatient.push(pi);
        // Add to Clinic contracts list
        CreateContractEvent("5");
        address[] currentContractListOfClinic = _clinicContractList[inClinic];
        CreateContractEvent("6");
        currentContractListOfClinic.push(pi);
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
     * Returns list of contracts of a clinic
     * @param inClinic address of clinic
     * @return address[] list of contract addresses
     */
    function getClinicContracts(address inClinic) returns (address[]) {
        return _clinicContractList[inClinic];
    }
    
}