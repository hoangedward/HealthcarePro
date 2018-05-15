import React, { Component } from 'react';
import { Card, Button, Input, Grid, Form, Message, Checkbox, List } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';

import ContractCP from '../../ethereum/ContractCP';
import ContractPI from '../../ethereum/ContractPI';

import Accounts from '../../ethereum/const/Accounts.json';
import DeployAddress from '../../ethereum/deployed_address.json';

import { eth } from '../../utils/eth';
import { datetime } from '../../utils/datetime';

class EventIndex extends Component {

	state = {
		errorMessage: '',
		loading: true,
		address: '',
		contractType: '',
		eventList: []
	};

	async componentDidMount() {
		this.setState({ loading: false });
	}

	onSearch = async event => {

		event.preventDefault();

		let eventList = [];
		let errorList = [];
		let contractAddress = this.state.address;

		this.setState({ loading: true, errorMessage: '' });

		if (contractAddress == '') {
			this.setState({ errorMessage: 'Please enter contract address to search!!!' });
		}
		if (this.state.contractType == '') {
			this.setState({ errorMessage: 'Please contract type (CP/PI) to search!!!' });
		}
		else {
			if (this.state.contractType == 'cp') {
				const contractCP = ContractCP(contractAddress);
				contractCP.getPastEvents('ContractSigned', {
					fromBlock: '0',
					toBlock: 'latest'
				}, function (error, events) {
					for (let i = 0; i < events.length; i++) {
						var eventObj = events[i];
					}
				});
			}
			else if (this.state.contractType == 'pi') {
				const contractPI = ContractPI(contractAddress);
				let events = await contractPI.getPastEvents('ContractSigned', {
					fromBlock: '0',
					toBlock: 'latest'
				});
				for(let i = 0; i < events.length; i++) {
					eventList.push({event: events[i], contractAddress: contractAddress, type: 'ContractSigned'});
				}
				this.setState({ eventList: eventList });
			}

		}

		this.setState({ loading: false });
	}

	handleChange = (e, { value }) => this.setState({ contractType: value })

	renderEventList() {

		let items = [];
		let eventList = this.state.eventList;

		items = eventList.map(eventInfo => {
			let ret = eventInfo.event.returnValues;
			return (
				<List.Item>
					<List.Icon name='announcement' size='large' verticalAlign='middle' />
					<List.Content>
						<List.Header as='a'>
							<Link route={`/insurer/view/${eventInfo.contractAddress}`}>
								<a>{eventInfo.type}</a>
							</Link>
						</List.Header>
						<List.Description as='a'>
							[Time: {datetime.fromTimestamp(ret._time)}] - Patient {ret._patient} has signed a contract with Insurer {ret._insurer}. (PackId: {ret._packId}, Period: {ret._period}) Contract Value: {eth.fromWei(ret._contractValue, 'ether')} ETH</List.Description>
					</List.Content>
				</List.Item>
			)

		});

		return <List divided relaxed items={items} />
	}

	render() {
		return (
			<Layout>
				<div>
					<h3>Solidity Event Page</h3>
					<Link route="/">
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
					<Form error={!!this.state.errorMessage} loading={this.state.loading}>
						<Message error header="Oops!" content={this.state.errorMessage} />
						<h4>Search Event Infomation</h4>
						<p>Please input contract address to see all its event until now:</p>
						<Grid columns='equal' divided>
							<Grid.Row stretched>
								<Grid.Column>
									<Input
										placeholder='Enter address...'
										fluid
										label="address"
										labelPosition="right"
										value={this.state.address}
										onChange={event =>
											this.setState({ address: event.target.value })}
									/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Button onClick={this.onSearch} primary content='Search' icon='search' labelPosition='left' floated='right' />
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={2}>
									<Checkbox
										radio
										label='Contract CP'
										name='checkboxRadioGroup'
										value='cp'
										checked={this.state.contractType === 'cp'}
										onChange={this.handleChange}
									/>
								</Grid.Column>
								<Grid.Column width={2}>
									<Checkbox
										radio
										label='Contract PI'
										name='checkboxRadioGroup'
										value='pi'
										checked={this.state.contractType === 'pi'}
										onChange={this.handleChange}
									/>
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<h4>Event list:</h4>
						{this.renderEventList()}
					</Form>

				</div>
			</Layout>
		);
	}
}

export default EventIndex;
