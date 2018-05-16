import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Router, Link } from '../../routes';
import EtherUint from '../../components/EtherUint';

import ContractPI from '../../ethereum/ContractPI';
import ContractPIList from '../../ethereum/ContractPIList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import { Pi } from '../../utils/pi';
import { datetime } from '../../utils/datetime';
import { eth } from '../../utils/eth';

class InsurerViewIndex extends Component {

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
			balance: summary[8],
			loading: false
		});

	}

	state = {
		errorMessage: '',
		loading: true,
	};

	isEnableButton(name) {
		if (name == "claimQueue") {
			if (this.state.status != 4 && this.state.status != 5) {
				return true;
			}
			return false;
		}
		else if (name == "confirm") {
			if (this.state.status == 1) {
				return true;
			}
			return false;
		}
		else if (name == "reject") {
			if (this.state.status == 1) {
				return true;
			}
			return false;
		}

	};

	onConfirm = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.state.address);

		try {
			await contractPI.methods
				.insurerConfirm()
				.send({
					from: Accounts.Insurer,
					gas: 4000000
				});

			Router.pushRoute('/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	onReject = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		const contractPI = ContractPI(this.state.address);

		try {
			await contractPI.methods
				.insurerReject()
				.send({
					from: Accounts.Insurer,
					gas: 4000000
				});

			Router.pushRoute('/insurer');
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	render() {
		return (
			<Layout>
				<h3>Insurance Contract Infomation</h3>
				<Form error={!!this.state.errorMessage} loading={this.state.loading}>
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
							<Button primary disabled={!this.isEnableButton("confirm")} onClick={this.onConfirm}>Confirm</Button>
							<Button color='red' disabled={!this.isEnableButton("reject")} onClick={this.onReject}>Reject</Button>
							<Link route={`/insurer/claimqueue/${this.state.address}`}>
								<a>
									<Button color='olive' disabled={!this.isEnableButton("claimQueue")} >Claim Queue</Button>
								</a>
							</Link>
							<Link route="/insurer">
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

export default InsurerViewIndex;
