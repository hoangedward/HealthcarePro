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
    
    mapping(uint => Option[]) _availableOptionsList;
    
    Option private _tempSelectedOption;
	
	address private _insurer;
    
    constructor(address inInusrer) public {
        _insurer = inInusrer;
        
        Option memory optionG6 = Option(1, 6, 20);
    	Option memory optionG12 = Option(2, 12, 30);
    	
        _availableOptionsList[1].push(optionG6);
        _availableOptionsList[1].push(optionG12);
        
    	Option memory optionP6 = Option(3, 6, 30);
    	Option memory optionP12 = Option(4, 12, 40);
      
        _availableOptionsList[2].push(optionP6);
        _availableOptionsList[2].push(optionP12);
        
    }
    
    function addItem(uint inPackId, uint inOptionIndex, uint inItemId, uint inPercent) external {
         Item memory item = Item(inItemId, inPercent);
        _availableOptionsList[inPackId][inOptionIndex].items[inItemId] = item;
    }
    
    function getOwner() external view returns (address) {
        return _insurer;
    }

	function _getOption(uint inPackId, uint inNumberOfMonths) internal view returns (Option) {
		Option[] storage optionsForPack = _availableOptionsList[inPackId];
        for (uint i = 0; i < optionsForPack.length; i++) {
            if(optionsForPack[i].period == inNumberOfMonths) {
                return optionsForPack[i];
            }
        }
	}

	function calculateClaimAmount(uint inPackId, uint inNumberOfMonths, uint[] inCheckItems, uint[] inCheckPrices) external view returns (uint) {
        uint sum = 0;
        
        Option storage matchedOption;
        Option[] storage optionsForPack = _availableOptionsList[inPackId];
        for (uint x = 0; x < optionsForPack.length; x++) {
            if(optionsForPack[x].period == inNumberOfMonths) {
                matchedOption = optionsForPack[x];
            }
        }
        
        for(uint i = 0; i < inCheckItems.length; i++) {
			Item memory matchedItem = matchedOption.items[1];
            if(matchedItem.id > 0) {
                sum += matchedItem.percent * inCheckPrices[i] / 100;
            }
        }
        
        return sum;
    }

	function calculateContractValue(uint inPackId, uint inNumberOfMonths) external view returns (uint) {
        Option memory matchedOption = _getOption(inPackId, inNumberOfMonths);
        if(matchedOption.id > 0) {
            return matchedOption.price;
        }
        return 0;
    }
    
}