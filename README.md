# Healthcare Pro

## Run below command to install/download node modules
	```javascript
	npm install
	```
	
## Start Ganache
	```javascript
	Setting port number: 8545
	```

## List of account (using Ganache):
	```javascript
	[0]: Admin account: use to deploy ContractList, ...
	[1]: Patient
	[2]: Clinic
	[3]: Insurer
	```
	
## Compile:
	
	```javascript
	// Use nodejs to compile all contracts
	node compile.js
	```
	
## ContractPI:
Step 1: Deploy static contracts:
	```javascript
	// Use deploy script (/ethereum/deploy_pi.js)
	node deploy_pi.js
		// - Patient deploy InsuranceCategory
		// - Admin deploy ContractPIList
	```
		
## ContractCP:
	TODO

## Run below command to start server at localhost:3000
	```javascript
	npm run dev
	```
	
	
## TODO:
	compile.js: after run, go to build folder and rename contract json file
		Ex: ClinicCategory.solClinicCategory.json ==> ClinicCategory.json
## Some note:
	```javascript
	npm install --save web3-providers-http
	npm install -save query-string
	```


