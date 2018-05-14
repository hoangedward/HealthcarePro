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
		});

	}

	state = {
		errorMessage: '',
		loading: false,
	};

	isEnableButton(name) {
		if (name == "withdraw") {
			if (this.state.endDate >= Date.now()) {
				return true;
			}
			return false;
		}
		else if (name == "claimQueue") {
			return true;
		}

	}

	onWithdraw = async event => {
		event.preventDefault();

		const contractPI = ContractPI(this.state.address);

		try {
			await contractPI.methods
				.requestForWithdraw()
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
							<Button color='teal' disabled={!this.isEnableButton("withdraw")} onClick={this.onWithdraw}>Withdraw</Button>
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

export default CampaignIndex;
