import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import DeployAddress from '../../ethereum/deployed_address.json';

class CampaignIndex extends Component {
	
	state = {
		balance: []
	};
	
	async componentDidMount() {
    var balanceMap = [];
		balanceMap[Accounts['Admin']] = await web3.eth.getBalance(Accounts.Admin);
		balanceMap[Accounts['Patient']] = await web3.eth.getBalance(Accounts['Patient']);
		balanceMap[Accounts['Clinic']] = await web3.eth.getBalance(Accounts['Clinic']);
		balanceMap[Accounts['Insurer']] = await web3.eth.getBalance(Accounts['Insurer']);
		balanceMap[DeployAddress['ContractPIList']] = await web3.eth.getBalance(DeployAddress['ContractPIList']);
		balanceMap[DeployAddress['InsuranceCategory']] = await web3.eth.getBalance(DeployAddress['InsuranceCategory']);
		this.setState( {balance: balanceMap} );
  }
	
	getBalance(account) {
		var balance = this.state.balance[account];
		if(typeof balance === "undefined") {
			balance = '0';
		}
		return web3.utils.fromWei('' + balance, 'ether');
	}

  render() {
    return (
      <Layout>
        <div>
          <h3>Administration Page</h3>
					<Link route="/">
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
					<h4>Account Infomation</h4>
					<div class="ui segments">
						<div class="ui segment">
							<strong>Name: </strong> Admin
							<br/>
							<strong>Address: </strong> {Accounts['Admin']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(Accounts['Admin'])} ETH
						</div>
						<div class="ui red segment">
							<strong>Name: </strong> Patient
							<br/>
							<strong>Address: </strong> {Accounts['Patient']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(Accounts['Patient'])} ETH
						</div>
						<div class="ui blue segment">
							<strong>Name: </strong> Clinic
							<br/>
							<strong>Address: </strong> {Accounts['Clinic']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(Accounts['Clinic'])} ETH
						</div>
						<div class="ui green segment">
							<strong>Name: </strong> Insurer
							<br/>
							<strong>Address: </strong> {Accounts['Insurer']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(Accounts['Insurer'])} ETH
						</div>
					</div>
					
					<h4>Insurance Static Contracts</h4>
					<div class="ui segments">
						<div class="ui segment">
							<Button content='Deploy' primary floated='right' />
							<strong>Name: </strong> ContractPIList
							<br/>
							<strong>Address: </strong> {DeployAddress['ContractPIList']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(DeployAddress['ContractPIList'])} ETH
						</div>
						<div class="ui red segment">
							<Button content='Deploy' primary floated='right' />
							<strong>Name: </strong> InsuranceCategory
							<br/>
							<strong>Address: </strong> {DeployAddress['InsuranceCategory']}
							<br/>
							<strong>Balance: </strong> {this.getBalance(DeployAddress['InsuranceCategory'])} ETH
						</div>
					</div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
