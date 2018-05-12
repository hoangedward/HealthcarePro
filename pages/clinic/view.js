import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label, Input } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';

import ContractCP from '../../ethereum/ContractCP';
import ContractCPList from '../../ethereum/ContractCPList';
import ContractPIList from '../../ethereum/ContractPIList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import { Cp } from './cp';
import { datetime } from '../../utils/datetime';
import { eth } from '../../utils/eth';

class CampaignIndex extends Component {

	static async getInitialProps(props) {
		const summary = await Cp.getSummary(props.query.address);
		return {
			address: props.query.address,
			status: summary[0],
			patient: summary[1],
			clinic: summary[2],
			checkedItems: summary[3],
			totalContractValue: summary[4],
			balance: summary[5],
			document: summary[6],
			contractPi: summary[7],
			patientPaidAmount: summary[8],
			insurerPaidAmount: summary[9]
		};
	}

	state = {
		errorMessage: '',
		loading: false,
		buttonStatus: [true, true],
		insuranceAddress: ''
	};

	isEnableButton(name) {
		if (name == "confirm") {
			if (this.props.status == 0) {
				return true;
			}
			return false;
		}
		else if (name == "requestPayment") {
			if (this.props.status == 1) {
				return true;
			}
			return false;
		}

	}

	onConfirm = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractCP = ContractCP(this.props.address);

		try {
			await contractCP.methods
				.clinicAcceptPatient(this.state.insuranceAddress)
				.send({
					from: Accounts.Clinic,
					gas: 6000000
				});

			Router.pushRoute('/clinic');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	onRequestPayment = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractCP = ContractCP(this.props.address);

		try {
			await contractCP.methods
				.calculateFee()
				.send({
					from: Accounts.Clinic,
					gas: 4000000
				});

			Router.pushRoute('/clinic');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<h3>Patient Contract Infomation</h3>
				<Form error={!!this.state.errorMessage}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<div>
						<Segment.Group>
							<Segment><strong>Contract Address: </strong>{this.props.address}</Segment>
							<Segment><strong>Status: </strong><Label color="green">{Cp.renderStatus(this.props.status)}</Label></Segment>
							<Segment><strong>Patient Address: </strong>{this.props.patient}</Segment>
							<Segment><strong>Insurance Address: </strong>{eth.renderAccount(this.props.contractPi)}</Segment>
							<Segment><strong>Clinic Address: </strong>{this.props.clinic}</Segment>
							<Segment><strong>Checked Items: </strong>{Cp.renderCheckedItems(this.props.checkedItems).join(', ')}</Segment>
							<Segment><strong>Total Value: </strong><Label color='violet'>{eth.fromWei(this.props.totalContractValue, 'ether')}<Label.Detail> ETH</Label.Detail></Label></Segment>
							<Segment><strong>Patient payment: </strong>{eth.fromWei(this.props.patientPaidAmount, 'ether')} ETH</Segment>
							<Segment><strong>Insurer payment: </strong>{eth.fromWei(this.props.insurerPaidAmount, 'ether')} ETH</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.props.balance, 'ether')} ETH</Segment>
							<Segment>
								<Link route={`/clinic/document/${this.props.address}`}>
									<a>
										<Button basic color='blue' content='View Document' icon='image' labelPosition='right' />
									</a>
								</Link>
							</Segment>
							{this.props.status == 0 ?
								<Segment>
									<div>
												<Input
													placeholder='Enter insurance address...'
													fluid
													label="address"
													labelPosition="right"
													value={this.state.insuranceAddress}
													onChange={event =>
														this.setState({ insuranceAddress: event.target.value })}
													/>
									</div>
								</Segment>
								: ''
							}
						</Segment.Group>
						<div>
							<Button color='teal' disabled={!this.isEnableButton("confirm")} onClick={this.onConfirm}>Confirm</Button>
							<Button color='orange' disabled={!this.isEnableButton("requestPayment")} onClick={this.onRequestPayment}>Request Payment</Button>
							<Link route="/clinic">
								<a>
									<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
								</a>
							</Link>
						</div>
					</div>
				</Form>
			</Layout>
		);
	}
}

export default CampaignIndex;
