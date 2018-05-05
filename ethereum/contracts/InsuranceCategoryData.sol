pragma solidity 0.4.23;
import "./InsuranceCategory.sol";

contract InsuranceCategoryData {
    
    constructor(address inInsuranceCategory) public {
        InsuranceCategory category = InsuranceCategory(inInsuranceCategory);
        
        category.addItem(1,0,1,100);
        category.addItem(1,0,2,80);
        category.addItem(1,0,3,80);
        category.addItem(1,0,4,50);
        
        category.addItem(1,1,1,100);
        category.addItem(1,1,2,80);
        category.addItem(1,1,3,80);
        category.addItem(1,1,4,50);
        
        category.addItem(2,0,1,100);
        category.addItem(2,0,2,100);
        category.addItem(2,0,3,100);
        category.addItem(2,0,4,80);
        category.addItem(2,0,5,80);
        category.addItem(2,0,6,50);
				
		category.addItem(2,1,1,100);
        category.addItem(2,1,2,100);
        category.addItem(2,1,3,100);
        category.addItem(2,1,4,80);
        category.addItem(2,1,5,80);
        category.addItem(2,1,6,50);
        
    }
    
}