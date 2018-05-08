pragma solidity 0.4.23;

contract InsuranceCategory {
    
    struct Item {
        uint id;
        uint percent;
    }
    
    struct Option {
		uint id;
        uint period;
        uint price;
        mapping(uint => Item) items;
    }
    
    mapping(uint => mapping(uint => Option)) _availableOptionsList;
	
	address private _insurer;
    
    constructor(address inInusrer) public {
        _insurer = inInusrer;
        
        Option memory optionG6 = Option(1, 6, 20 ether);
    	Option memory optionG12 = Option(2, 12, 30 ether);
    	
        _availableOptionsList[1][6] = optionG6;
        _availableOptionsList[1][12] = optionG12;
        
    	Option memory optionP6 = Option(3, 6, 30 ether);
    	Option memory optionP12 = Option(4, 12, 40 ether);
      
        _availableOptionsList[2][6] = optionP6;
        _availableOptionsList[2][12] = optionP12;
        
        _availableOptionsList[1][6].items[1] = Item(1, 100);
        _availableOptionsList[1][6].items[2] = Item(2, 80);
        _availableOptionsList[1][6].items[3] = Item(3, 80);
        _availableOptionsList[1][6].items[4] = Item(4, 50);
        
        _availableOptionsList[1][12].items[1] = Item(1, 100);
        _availableOptionsList[1][12].items[2] = Item(2, 80);
        _availableOptionsList[1][12].items[3] = Item(3, 80);
        _availableOptionsList[1][12].items[4] = Item(4, 50);
        
        _availableOptionsList[2][6].items[1] = Item(1, 100);
        _availableOptionsList[2][6].items[2] = Item(2, 100);
        _availableOptionsList[2][6].items[3] = Item(3, 100);
        _availableOptionsList[2][6].items[4] = Item(4, 80);
        _availableOptionsList[2][6].items[5] = Item(5, 80);
        _availableOptionsList[2][6].items[6] = Item(6, 50);
        
        _availableOptionsList[2][12].items[1] = Item(1, 100);
        _availableOptionsList[2][12].items[2] = Item(2, 100);
        _availableOptionsList[2][12].items[3] = Item(3, 100);
        _availableOptionsList[2][12].items[4] = Item(4, 80);
        _availableOptionsList[2][12].items[5] = Item(5, 80);
        _availableOptionsList[2][12].items[6] = Item(6, 50);
        
    }
    
    function getOwner() external view returns (address) {
        return _insurer;
    }

	function calculateClaimAmount(uint inPackId, uint inNumberOfMonths, uint[] inCheckItems, uint[] inCheckPrices) external view returns (uint) {
        uint sum = 0;
        
        Option storage matchedOption = _availableOptionsList[inPackId][inNumberOfMonths];
        
        for(uint i = 0; i < inCheckItems.length; i++) {
			Item memory matchedItem = matchedOption.items[inCheckItems[i]];
            if(matchedItem.id > 0) {
                sum += matchedItem.percent * inCheckPrices[i] / 100;
            }
        }
        
        return sum;
    }

	function calculateContractValue(uint inPackId, uint inNumberOfMonths) external view returns (uint) {
        Option memory matchedOption = _availableOptionsList[inPackId][inNumberOfMonths];
        if(matchedOption.id > 0) {
            return matchedOption.price;
        }
        return 0;
    }
    
}