# Healthcare Pro

## Config proxy:
	Copy \MISC\.gitconfig and \MISC\.npmrc to C:\Users\{UserName}


## Run below command to install/download node modules
	npm install
	You might need to install Windows Build Tool
		npm install --global --production windows-build-tools
		npm install --global node-gyp
		Then try again: npm install

## Start Ganache
	Download at: http://truffleframework.com/ganache/
	Setting port number: 8545
	Mnemonic: sponsor affair like elephant sunset close army wealth fence update awesome act

## List of account (using Ganache):
	[0]: Admin account: use to deploy ContractList, ...
	[1]: Patient
	[2]: Clinic
	[3]: Insurer
	
## Compile:
	Use nodejs to compile all contracts
		node compile.js
		
## Deploy static contracts:
	Using script /ethereum/deploy.bat
	
	ContractPI:
	Deploy static contracts:
			- Patient deploy InsuranceCategory
			- Admin deploy ContractPIList
			Edit /ethereum/ContractPIList.js: use address of deployed ContractPIList
			Edit /pages/patient/insurer/confirm,js: use address of deployed InInsurerCategory
		
	ContractCP:
			- Patient deploy ClinicCategory
			- Admin deploy ContractCPList
		
		Note: In additional, after static contracts had been deployed the contract addresses
		have been written into deployed_address.json. Example content:
			{"InsuranceCategory":"0x471C92F915ae766C4964eEdC300e5b8FF41e443c",
			"ContractPIList":"0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0",
			"ClinicCategory":"0x57Dae64f612f50D10381476fAafd625fB3552652",
			"ContractCPList":"0x345cA3e014Aaf5dcA488057592ee47305D9B3e10"}

## Run below command to start server at localhost:3000
	npm run dev
	
## TODO:
	XXX

## Some note:
	npm install --save web3-providers-http
	npm install -save query-string
	
## semantic-ui-react
	https://react.semantic-ui.com/


