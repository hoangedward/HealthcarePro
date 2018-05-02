pragma solidity ^0.4.18;
import "./ContractPI.sol";


contract ClinicCategory {

    struct Item {
        uint id;
        uint price;
    }
    
    address public _clinic;
    
    mapping(uint => Item) _availableItems;
    
    function ClinicCategory(address inClinic) {
        _clinic = inClinic;
        
        {
            Item memory item1 = Item(1, 1);
            _availableItems[1] = item1;
        }
        {
            Item memory item2 = Item(2, 2);
            _availableItems[2] = item2;
        }
        {
            Item memory item3 = Item(3, 2);
            _availableItems[3] = item3;
        }
		{
            Item memory item4 = Item(4, 3);
            _availableItems[4] = item4;
        }
		{
            Item memory item5 = Item(5, 10);
            _availableItems[5] = item5;
        }
		{
            Item memory item6 = Item(6, 5);
            _availableItems[6] = item6;
        }
       
    }
    
    function calFee(uint[] inCheckItems) external returns (uint) {
        uint totalFee = 0;
        for(uint i = 0; i < inCheckItems.length; i++) {
            Item foundItem = _availableItems[inCheckItems[i]];
            if(foundItem.id < 1) {
                throw;
            }
            totalFee += foundItem.price;
        }
        return totalFee;
    }

	function getOwner() external returns (address) {
		return _clinic;
	}

}