import React, { Component } from 'react';
import { Form, Button, Message, Segment, Modal, Header, Label } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import EtherUint from '../../../components/EtherUint';
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
		return {
			address: props.query.address,
		};
	}

	async componentDidMount() {
		const summary = await Pi.getSummary(this.props.address);

		this.setState( {
			address: this.props.address,
			status: summary[0],
			patient: summary[1],
			insurer: summary[2],
			packId: summary[3],
			period: summary[4],
			totalContractValue: summary[5],
			startDate: summary[6],
			endDate: summary[7],
			balance: summary[8]
		} );
	}

	state = {
		errorMessage: '',
		loading: false,
		buttonStatus: [true, true],
		confirmOpen: false,
		cancelOpen: false
	};

	isEnableButton(name) {
		if (name == "confirm") {
			if (this.state.status == 0) {
				return true;
			}
			return false;
		}
		else if (name == "cancel") {
			if (this.state.status == 0) {
				return true;
			}
			return false;
		}

	}

	onConfirm = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.state.address);

		try {
			await contractPI.methods
				.patientConfirm(this.state.totalContractValue)
				.send({
					from: Accounts.Patient,
					gas: 4000000,
					value: this.state.totalContractValue
				});

			Router.pushRoute('/patient/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false, confirmOpen: false });
	};

	onCancel = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		try {
			await ContractPIList.methods
				.patientCancel(this.state.address)
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
							<Segment><strong>Contract Address: </strong>{this.state.address}</Segment>
							<Segment><strong>Status: </strong><Label color={Pi.renderStatusColor(this.state.status)}>{Pi.renderStatus(this.state.status)}</Label></Segment>
							<Segment><strong>Patient Address: </strong>{this.state.patient}</Segment>
							<Segment><strong>Insurer Address: </strong>{this.state.insurer}</Segment>
							<Segment><strong>Pack Name: </strong>{Pi.renderPackName(this.state.packId)} ({Pi.renderPeriod(this.state.period)})</Segment>
							<Segment><strong>Total Value: </strong><EtherUint value={this.state.totalContractValue}/></Segment>
							<Segment><strong>Start Date: </strong>{datetime.fromTimestamp(this.state.startDate)}</Segment>
							<Segment><strong>End Date: </strong>{datetime.fromTimestamp(this.state.endDate)}</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.state.balance, 'ether')} ETH</Segment>
						</Segment.Group>
						<div>
							<Modal open={this.state.confirmOpen} size='tiny'
								trigger={<Button color='teal' disabled={!this.isEnableButton("confirm")} onClick={() => {this.setState({confirmOpen: true})}}>Confirm</Button>}
								closeOnRootNodeClick='false'>
								<Modal.Header>Confirm the transaction</Modal.Header>
								<Modal.Content>
									<p>Do you want to sumbit this transaction?</p>
									<p><strong>Amount: </strong>
										<Label color='violet'>
											{eth.fromWei(this.state.totalContractValue, 'ether')}
											<Label.Detail>ETH</Label.Detail>
										</Label>
									</p>
									<p>To Account: <strong>{this.state.address}</strong></p>
								</Modal.Content>
								<Modal.Actions>
									<Button negative onClick={() => {this.setState({confirmOpen: false})}}>No</Button>
									<Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={this.onConfirm} loading={this.state.loading} />
								</Modal.Actions>
							</Modal>

							<Modal open={this.state.cancelOpen} size='tiny'
								trigger={<Button color='grey' disabled={!this.isEnableButton("cancel")} onClick={() => {this.setState({cancelOpen: true})}}>Cancel</Button>}
								closeOnRootNodeClick='false'>
								<Modal.Header>Confirm the transaction</Modal.Header>
								<Modal.Content>
									<p>Are you sure to cancel this transaction?</p>
								</Modal.Content>
								<Modal.Actions>
									<Button negative onClick={() => {this.setState({cancelOpen: false})}}>No</Button>
									<Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={this.onCancel} loading={this.state.loading} />
								</Modal.Actions>
							</Modal>

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
