import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label, Icon } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import EtherUint from '../../../components/EtherUint';
import { Router, Link } from '../../../routes';

import ContractCP from '../../../ethereum/ContractCP';
import ContractCPList from '../../../ethereum/ContractCPList';
import ContractPIList from '../../../ethereum/ContractPIList';
import web3 from '../../../ethereum/web3';

import Accounts from '../../../ethereum/const/Accounts.json';
import { Cp } from '../../clinic/cp';
import { datetime } from '../../../utils/datetime';
import { eth } from '../../../utils/eth';

import {ConfirmTransaction, Confirm} from '../../../components/Confirm';

class PatientClinicViewIndex extends Component {

	static async getInitialProps(props) {
		return {
			address: props.query.address,
		};
	}

	async componentDidMount() {
		const summary = await Cp.getSummary(this.props.address);
		this.setState( {
			address: this.props.address,
			status: summary[0],
			patient: summary[1],
			clinic: summary[2],
			checkedItems: summary[3],
			totalContractValue: summary[4],
			balance: summary[5],
			document: summary[6],
			contractPi: summary[7],
			patientPaidAmount: summary[8],
			insurerPaidAmount: summary[9],
			loading: false
		} );
	}

	state = {
		errorMessage: '',
		loading: true,
		checkedItems: [],
		confirmOpen: false,
		cancelOpen: false
	};

	isEnableButton(name) {
		if (name == "cancel") {
			if (this.state.status == 0) {
				return true;
			}
			return false;
		}
		else if (name == "pay") {
			if (this.state.status == 1) {
				return true;
			}
			return false;
		}
		else if (name == "finish") {
			if (this.state.status == 2) {
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
				.patientCancel(this.state.address)
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

		const contractCP = ContractCP(this.state.address);

		try {
			await contractCP.methods
				.patientPay()
				.send({
					from: Accounts.Patient,
					gas: 4000000,
					value: this.state.patientPaidAmount
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

		const contractCP = ContractCP(this.state.address);

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
				<Form error={!!this.state.errorMessage} loading={this.state.loading}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<div>
						<Segment.Group>
							<Segment><strong>Contract Address: </strong>{this.state.address}</Segment>
							<Segment><strong>Status: </strong><Label color={Cp.renderStatusColor(this.state.status)}>{Cp.renderStatus(this.state.status)}</Label></Segment>
							<Segment><strong>Patient Address: </strong>{this.state.patient}</Segment>
							<Segment><strong>Insurance Address: </strong>{eth.renderAccount(this.state.contractPi)}</Segment>
							<Segment><strong>Clinic Address: </strong>{this.state.clinic}</Segment>
							<Segment><strong>Checked Items: </strong>{Cp.renderCheckedItems(this.state.checkedItems).join(', ')}</Segment>
							<Segment><strong>Total Value: </strong><EtherUint value={this.state.totalContractValue}/></Segment>
							<Segment><strong>Patient payment: </strong>{eth.fromWei(this.state.patientPaidAmount, 'ether')} ETH</Segment>
							<Segment><strong>Insurer payment: </strong>{eth.fromWei(this.state.insurerPaidAmount, 'ether')} ETH</Segment>
							<Segment><strong>Balance: </strong>{eth.fromWei(this.state.balance, 'ether')} ETH</Segment>
							<Segment>
								<Link route={`/clinic/document/${this.state.address}`}>
									<a>
										<Button basic color='blue' content='View Document' icon='image' labelPosition='right' />
									</a>
								</Link>
							</Segment>
						</Segment.Group>
						<div>
							<ConfirmTransaction 
									open={this.state.confirmOpen}
									amount={this.state.patientPaidAmount}
									toAccount={this.state.address}
									onNo={() => {this.setState({confirmOpen: false})}}
									onYes={this.onPayment}
									loading={this.state.loading}
								/>
							<Button color='orange' icon labelPosition='right' disabled={!this.isEnableButton("pay")} onClick={() => {this.setState({confirmOpen: true})}}>
								<Icon name='money' />
								Pay
							</Button>
							<Button color='green' icon labelPosition='right' disabled={!this.isEnableButton("finish")} onClick={this.onFinish}>
								<Icon name='smile' />
								Finish
							</Button>
							<Confirm
								open={this.state.cancelOpen}
								onNo={() => {this.setState({cancelOpen: false})}}
								onYes={this.onCancel}
								loading={this.state.loading}
							/>
							<Button color='grey' disabled={!this.isEnableButton("cancel")} onClick={() => {this.setState({cancelOpen: true})}} >Cancel</Button>
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

export default PatientClinicViewIndex;
