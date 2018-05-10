import React, { Component } from 'react';
import { Form, Button, Message, Segment } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Router, Link } from '../../../routes';

import ContractPI from '../../../ethereum/ContractPI';
import ContractPIList from '../../../ethereum/ContractPIList';
import web3 from '../../../ethereum/web3';

import Accounts from '../../../ethereum/const/Accounts.json';
import { Pi } from '../../../utils/pi';
import { datetime } from '../../../utils/datetime';
import { eth } from '../../../utils/eth';

class CampaignIndex extends Component {

	static async getInitialProps(props) {
		const summary = await Pi.getSummary(props.query.address);

		return {
			address: props.query.address,
			status: summary[0],
			patient: summary[1],
			insurer: summary[2],
			packId: summary[3],
			period: summary[4],
			totalContractValue: summary[5],
			startDate: summary[6],
			endDate: summary[7],
			balance: summary[8]
		};
	}

	state = {
		errorMessage: '',
		loading: false,
		buttonStatus: [true, true]
	};

	isEnableButton(name) {
		if (name == "confirm") {
			if (this.props.status == 0) {
				return true;
			}
			return false;
		}
		else if (name == "cancel") {
			if (this.props.status == 0) {
				return true;
			}
			return false;
		}

	}

	onConfirm = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.props.address);

		try {
			await contractPI.methods
				.patientConfirm(this.props.totalContractValue)
				.send({
					from: Accounts.Patient,
					gas: 4000000,
					value: this.props.totalContractValue
				});

			Router.pushRoute('/patient/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	onCancel = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		try {
			await ContractPIList.methods
				.patientCancel(this.props.address)
				.send({
					from: Accounts.Patient,
					gas: 4000000
				});

			Router.pushRoute('/patient/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<h3>Insurance Contract Infomation</h3>
				<Form error={!!this.state.errorMessage}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<div>
						<Segment.Group>
							<Segment><strong>Contract Address: </strong>{this.props.address}</Segment>
							<Segment><strong>Status: </strong>{Pi.renderStatus(this.props.status)}</Segment>
							<Segment><strong>Patient Address: </strong>{this.props.patient}</Segment>
							<Segment><strong>Insurer Address: </strong>{this.props.insurer}</Segment>
							<Segment><strong>Pack Name: </strong>{Pi.renderPackName(this.props.packId)} ({Pi.renderPeriod(this.props.period)})</Segment>
							<Segment><strong>Total Value: </strong>{eth.fromWei(this.props.totalContractValue, 'ether')} ETH</Segment>
							<Segment><strong>Start Date: </strong>{datetime.fromTimestamp(this.props.startDate)}</Segment>
							<Segment><strong>End Date: </strong>{datetime.fromTimestamp(this.props.endDate)}</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.props.balance, 'ether')} ETH</Segment>
						</Segment.Group>
						<div>
							<Button color='teal' disabled={!this.isEnableButton("confirm")} onClick={this.onConfirm}>Confirm</Button>
							<Button color='grey' disabled={!this.isEnableButton("cancel")} onClick={this.onCancel} >Cancel</Button>
							<Link route="/patient/insurer">
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
