writeAddressJson = function(address_type, address_value) {
    // Reading current address json info
    const fs = require('fs');
    let deployed_address = 'deployed_address.json';
    let rawdata = fs.readFileSync(deployed_address);
    let addresses = {};
    try {
        addresses = JSON.parse(rawdata);
    } catch (e) {
        // Empty data
    }
    console.log("Current content: ");
    console.log(addresses);
    // Adding into Json object
    addresses[address_type] = address_value;
    // Write to reuslt file
    let data = JSON.stringify(addresses);
    fs.writeFileSync(deployed_address, data);
    console.log("Modified content: ");
    console.log(addresses);
}