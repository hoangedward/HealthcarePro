pragma solidity ^0.4.18;


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
    
    Option optionG6 = Option(1, 6, 20);
	Option optionG12 = Option(2, 12, 30);
	
    Item itemG_1 = Item(1, 100);
    Item itemG_2 = Item(2, 80);
    Item itemG_3 = Item(3, 80);
    Item itemG_4 = Item(4, 50);
    
    Option optionP6 = Option(3, 6, 30);
	Option optionP12 = Option(4, 12, 40);
	
    Item itemP_1 = Item(1, 100);
    Item itemP_2 = Item(2, 100);
    Item itemP_3 = Item(3, 100);
    Item itemP_4 = Item(4, 80);
    Item itemP_5 = Item(5, 80);
    Item itemP_6 = Item(6, 50);
	
	address private _insurer;
    
    function InsuranceCategory(address inInusrer) {
        _insurer = inInusrer;
        
        // Option 1: General - 6 months
        optionG6.items[1] = itemG_1;
        optionG6.items[2] = itemG_2;
        optionG6.items[3] = itemG_3;
		optionG6.items[4] = itemG_4;
		
		// Option 1: General - 12 months
        optionG12.items[1] = itemG_1;
        optionG12.items[2] = itemG_2;
        optionG12.items[3] = itemG_3;
		optionG12.items[4] = itemG_4;
        
        Option[] generalOptions;
        generalOptions.push(optionG6);
		generalOptions.push(optionG12);
        _availableOptionsList[1] = generalOptions;
        
        // Option 2: Premium - 6 months
        optionP6.items[1] = itemP_1;
        optionP6.items[2] = itemP_2;
        optionP6.items[3] = itemP_3;
		optionP6.items[4] = itemP_4;
		optionP6.items[5] = itemP_5;
		optionP6.items[6] = itemP_6;
		
		// Option 2: Premium - 12 months
        optionP12.items[1] = itemP_1;
        optionP12.items[2] = itemP_2;
        optionP12.items[3] = itemP_3;
		optionP12.items[4] = itemP_4;
		optionP12.items[5] = itemP_5;
		optionP12.items[6] = itemP_6;
        
        Option[] premiumOptions;
        premiumOptions.push(optionP6);
		premiumOptions.push(optionP12);
        _availableOptionsList[2] = premiumOptions;
        
    }
    
    function getOwner() external returns (address) {
        return _insurer;
    }

	function getOption(uint inPackId, uint inNumberOfMonths) external returns (uint) {
		Option[] optionsForPack = _availableOptionsList[inPackId];
        for (uint i = 0; i < optionsForPack.length; i++) {
            if(optionsForPack[i].period == inNumberOfMonths) {
                return optionsForPack[i].id;
            }
        }
	}

	function _getOption(uint inPackId, uint inNumberOfMonths) internal returns (Option) {
		Option[] optionsForPack = _availableOptionsList[inPackId];
        for (uint i = 0; i < optionsForPack.length; i++) {
            if(optionsForPack[i].period == inNumberOfMonths) {
                return optionsForPack[i];
            }
        }
	}

	function calculateClaimAmount(uint inPackId, uint inNumberOfMonths, uint[] inCheckItems, uint[] inCheckPrices) returns (uint) {
        uint sum = 0;
       _tempSelectedOption = _getOption(inPackId, inNumberOfMonths);
        for(uint i = 0; i < inCheckItems.length; i++) {
			Item matchedItem = _tempSelectedOption.items[inCheckItems[i]];
            if(matchedItem.id > 0) {
                sum += matchedItem.percent * inCheckPrices[i] / 100;
            }
        }
        return sum;
    }

	function calculateContractValue(uint inPackId, uint inNumberOfMonths) external returns (uint) {
        Option memory matchedOption = _getOption(inPackId, inNumberOfMonths);
        if(matchedOption.id > 0) {
            return matchedOption.price;
        }
        return 0;
    }
    
}