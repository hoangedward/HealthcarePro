import React, { Component } from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';

import ContractPI from '../../ethereum/ContractPI';
import ContractPIList from '../../ethereum/ContractPIList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import {Pi} from '../../utils/pi';
import {datetime} from '../../utils/datetime';
import {eth} from '../../utils/eth';

class ClaimQueueIndex extends Component {
	
	static async getInitialProps(props) {
		
		const contractPI = ContractPI(props.query.address);
		
    const claimQueue = await 
		contractPI.methods.getClaimQueue().call({
					gas: 4000000
        });

    return { claimQueue };
  }

	 state = {
			contractStatus: []
	 };
	 
	 async getSummary(address) {
			 let summary = await Pi.getSummary(address);
			 var _contractStatus = this.state.contractStatus;
			 _contractStatus[address] = summary[0];// status (int)
			 this.setState({contractStatus: _contractStatus});
	 }
	
	renderContracts() {
     return this.props.claimQueue[0][0];
   }

  render() {
    return (
      <Layout>
				<h3>Claim List</h3>
				{this.renderContracts()}
					<p></p>
					<Link route="/">
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
      </Layout>
    );
  }
}

export default ClaimQueueIndex;
