import React, { Component } from 'react';
import { Form, Button, Message, Segment, Item, Label, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';

import ContractPI from '../../ethereum/ContractPI';
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
				
		var claimQueueArr = [];		
		
		var index = 0;
		const cpList = claimQueue[0];
		cpList.map(cp => {
			claimQueueArr[index] = new Object();
			claimQueueArr[index++].cp = cp;
		});
		
		index = 0;
		const patientList = claimQueue[1];
		patientList.map(patient => {
			claimQueueArr[index++].patient = patient;
		});
		
		index = 0;
		const amountList = claimQueue[2];
		amountList.map(amount => {
			claimQueueArr[index++].amount = amount;
		});
		
		index = 0;
		const paidList = claimQueue[3];
		paidList.map(paid => {
			claimQueueArr[index++].paid = paid;
		});

    return { address: props.query.address, claimQueueArr };
  }

	 state = {
		errorMessage: '',
		loading: false,
		buttonStatus: [true, true]
	};
	
	renderContracts() {
     const items = this.props.claimQueueArr.map(queue => {
			 return {
         header: (
						<div>
								{
									queue.paid ? 
													(
														<Button disabled as='div' labelPosition='right' size='mini' floated='right'>
															<Button color='gray' size='mini'>
																<Icon name='check circle' />
																Approved
															</Button>
															<Label size='mini' basic color='brown' pointing='left'>{queue.amount}</Label>
														</Button>
													)
													: 
													(
														<Button as='div' labelPosition='right' size='medium' floated='right' onClick={this.onApprove(queue.cp, queue.amount)}>
														<Button color='red' size='mini'>
															<Icon name='hand outline left' />
															Approve
														</Button>
														<Label size='mini' basic color='red' pointing='left'>{queue.amount}</Label>
													</Button>
													)
								}
								<strong>Contract CP: </strong>
								<Link route={`/clinic/view/${queue.cp}`}>
										 <a>
											{queue.cp}
										 </a>
								</Link>
						</div>
					),
         description: (
						 <div>
							<strong>Patient: </strong>{queue.patient}
						 </div>
         ),
				 meta: (
						<div>
							<strong>Claim Amount: </strong>{queue.amount} ETH
						 </div>
				 )
       };
		 });return <Item.Group divided items={items} />;
   }
	 
	 onApprove = (cp, amount) => async event => {
		 
		 event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.props.address);

    try {
      await contractPI.methods
        .insurerAcceptClaim(cp)
        .send({
          from: Accounts.Insurer,
					gas: 4000000,
					value: web3.utils.toWei(amount, 'ether')
        });

      Router.pushRoute('/patient/insurer');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

		this.setState({ loading: false });
		 
	 }

  render() {
    return (
      <Layout>
				<h3>Claim List</h3>
				<Form error={!!this.state.errorMessage}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					{this.renderContracts()}
					<p></p>
					<Link route={`/insurer/view/${this.props.address}`}>
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
				</Form>
      </Layout>
    );
  }
}

export default ClaimQueueIndex;
