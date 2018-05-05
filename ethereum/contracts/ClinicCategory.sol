pragma solidity 0.4.23;


contract ClinicCategory {

    struct Item {
        uint id;
        uint price;
    }
    
    address public _clinic;
    
    mapping(uint => Item) _availableItems;
    
    constructor(address inClinic) public {
        _clinic = inClinic;

        _availableItems[1] = Item(1, 1);
        _availableItems[2] = Item(2, 2);
        _availableItems[3] = Item(3, 2);
        _availableItems[4] = Item(4, 3);
        _availableItems[5] = Item(5, 10);
        _availableItems[6] = Item(6, 5);
    }

    function calFee(uint[] inCheckItems) external view returns (uint) {
        uint totalFee = 0;
        for(uint i = 0; i < inCheckItems.length; i++) {
            Item storage foundItem = _availableItems[inCheckItems[i]];
            if(foundItem.id < 1) {
                revert();
            }
            totalFee += foundItem.price;
        }
        return totalFee;
    }

	function getOwner() external view returns (address) {
		return _clinic;
	}
	
	function getCheckPrice(uint inCheckItem) external view returns (uint) {
	   return _availableItems[inCheckItem].price;
	}

}