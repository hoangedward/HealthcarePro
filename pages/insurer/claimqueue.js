import React, { Component } from 'react';
import { Form, Button, Message, Segment, Item, Label, Icon } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';

import ContractPI from '../../ethereum/ContractPI';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import { Pi } from '../../utils/pi';
import { datetime } from '../../utils/datetime';
import { eth } from '../../utils/eth';

import {ConfirmTransaction, ConfirmTransaction2, Confirm} from '../../components/Confirm';

class ClaimQueueIndex extends Component {

	static async getInitialProps(props) {
		return { address: props.query.address };
	}

	async componentDidMount() {
		const contractPI = ContractPI(this.props.address);

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

		this.setState({claimQueueArr: claimQueueArr, address: this.props.address, loading: false});
	}

	state = {
		errorMessage: '',
		loading: true,
		buttonStatus: [true, true],
		claimQueueArr: [],
		confirmOpen: false
	};

	renderContracts() {
		const items = this.state.claimQueueArr.map(queue => {
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
										<Label size='mini' basic color='brown' pointing='left'>{eth.fromWei(queue.amount, 'ether')}</Label>
									</Button>
								)
								:
								(
									<div>
										<ConfirmTransaction 
											open={this.state.confirmOpen}
											amount={queue.amount}
											toAccount={queue.cp}
											onNo={() => {this.setState({confirmOpen: false})}}
											onYes={this.onApprove(queue.cp, queue.amount)}
											loading={this.state.loading}
										/>
										<Button as='div' labelPosition='right' size='medium' floated='right' onClick={() => {this.setState({confirmOpen: true})}}>
											<Button color='red' size='mini'>
												<Icon name='hand outline left' />
												Approve
											</Button>
											<Label size='mini' basic color='red' pointing='left'>{eth.fromWei(queue.amount, 'ether')}</Label>
										</Button>
									</div>
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
						<p></p>
						<Link route={`/clinic/document/${queue.cp}`}>
						<a>
							<Button basic color='blue' content='View Document' icon='image' labelPosition='right' />
						</a>
					</Link>
					</div>
				),
				meta: (
					<div>
						<strong>Claim Amount: </strong>{eth.fromWei(queue.amount)} ETH
					</div>
				)
			};
		}); return <Item.Group divided items={items} />;
	}

	onApprove = (cp, amount) => async event => {

		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.state.address);

		try {
			await contractPI.methods
				.insurerAcceptClaim(cp)
				.send({
					from: Accounts.Insurer,
					gas: 4000000,
					value: amount
				});

			Router.pushRoute('/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });

	}

	render() {
		return (
			<Layout>
				<h3>Claim List</h3>
				<Form error={!!this.state.errorMessage} loading={this.state.loading}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					{this.renderContracts()}
					<p></p>
					<Link route={`/insurer/view/${this.state.address}`}>
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
