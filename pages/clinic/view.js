import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label } from 'semantic-ui-react';
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
		const patientContracts = await ContractPIList.methods.getPatientContracts(Accounts.Patient).call();
		const _calculateClaimAmount = await Cp.calculateClaimAmount(String(patientContracts[0]), props.query.address);
		return {
			address: props.query.address,
			status: summary[0],
			patient: summary[1],
			clinic: summary[2],
			checkedItems: summary[3],
			totalContractValue: summary[4],
			balance: summary[5],
			firstPatientContract: patientContracts[0],
			calculateClaimAmount: _calculateClaimAmount
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

		const contractCP = ContractCP(this.props.address);

		try {
			await contractCP.methods
				.clinicAcceptPatient(this.props.firstPatientContract)
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
							<Segment><strong>First Insurance Address: </strong>{this.props.firstPatientContract}</Segment>
							<Segment><strong>Clinic Address: </strong>{this.props.clinic}</Segment>
							<Segment><strong>Checked Items: </strong>{Cp.renderCheckedItems(this.props.checkedItems).join(', ')}</Segment>
							<Segment><strong>Total Value: </strong>{this.props.totalContractValue}/{this.props.calculateClaimAmount}</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.props.balance, 'ether')} ETH</Segment>
						</Segment.Group>
						<div>
							<Button color='teal' disabled={!this.isEnableButton("confirm")} onClick={this.onConfirm}>Confirm</Button>
							<Button color='grey' disabled={!this.isEnableButton("cancel")} onClick={this.onCancel} >Cancel</Button>
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
