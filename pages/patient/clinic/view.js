import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label, Icon } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Router, Link } from '../../../routes';

import ContractCP from '../../../ethereum/ContractCP';
import ContractCPList from '../../../ethereum/ContractCPList';
import ContractPIList from '../../../ethereum/ContractPIList';
import web3 from '../../../ethereum/web3';

import Accounts from '../../../ethereum/const/Accounts.json';
import { Cp } from '../../clinic/cp';
import { datetime } from '../../../utils/datetime';
import { eth } from '../../../utils/eth';

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
		loading: false
	};

	isEnableButton(name) {
		if (name == "cancel") {
			if (this.props.status == 0) {
				return true;
			}
			return false;
		}
		else if (name == "pay") {
			if (this.props.status == 1) {
				return true;
			}
			return false;
		}
		else if (name == "finish") {
			if (this.props.status == 2) {
				return true;
			}
			return false;
		}

	}

	onCancel = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		try {
			await ContractCPList.methods
				.patientCancel(this.props.address)
				.send({
					from: Accounts.Patient,
					gas: 4000000
				});

			Router.pushRoute('/patient/clinic');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	onPayment = async event => {

		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractCP = ContractCP(this.props.address);

		try {
			await contractCP.methods
				.patientPay()
				.send({
					from: Accounts.Patient,
					gas: 4000000,
					value: this.props.patientPaidAmount
				});

			Router.pushRoute('/patient/clinic');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });

	};

	onFinish = async event => {

		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractCP = ContractCP(this.props.address);

		try {
			await contractCP.methods
				.patientConfirm()
				.send({
					from: Accounts.Patient,
					gas: 4000000
				});

			Router.pushRoute('/patient/clinic');
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
							<Segment><strong>Insurance Address: </strong>{this.props.contractPi}</Segment>
							<Segment><strong>Clinic Address: </strong>{this.props.clinic}</Segment>
							<Segment><strong>Checked Items: </strong>{Cp.renderCheckedItems(this.props.checkedItems).join(', ')}</Segment>
							<Segment><strong>Total Value: </strong>{eth.fromWei(this.props.totalContractValue, 'ether')} ETH</Segment>
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
						</Segment.Group>
						<div>
							<Button color='orange' icon labelPosition='right' disabled={!this.isEnableButton("pay")} onClick={this.onPayment}>
								<Icon name='money' />
								Pay
							</Button>
							<Button color='green' icon labelPosition='right' disabled={!this.isEnableButton("finish")} onClick={this.onFinish}>
								<Icon name='smile' />
								Finish
							</Button>
							<Button color='grey' disabled={!this.isEnableButton("cancel")} onClick={this.onCancel} >Cancel</Button>
							<Link route="/patient/clinic">
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
