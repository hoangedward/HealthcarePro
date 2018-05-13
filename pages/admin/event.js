import React, { Component } from 'react';
import { Card, Button, Input, Grid, Form, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';
import DeployAddress from '../../ethereum/deployed_address.json';

class CampaignIndex extends Component {

	state = {
		errorMessage: '',
		loading: false,
		address: ''
	};

	async componentDidMount() {
		var balanceMap = [];
		balanceMap[Accounts.Admin] = await web3.eth.getBalance(Accounts.Admin);
		balanceMap[Accounts.Patient] = await web3.eth.getBalance(Accounts.Patient);
		balanceMap[Accounts.Clinic] = await web3.eth.getBalance(Accounts.Clinic);
		balanceMap[Accounts.Insurer] = await web3.eth.getBalance(Accounts.Insurer);
		balanceMap[DeployAddress.ContractPIList] = await web3.eth.getBalance(DeployAddress.ContractPIList);
		balanceMap[DeployAddress.InsuranceCategory] = await web3.eth.getBalance(DeployAddress.InsuranceCategory);
		this.setState({ balance: balanceMap });
	}

	onSearch = async event => {

		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		if (this.state.address == '') {
			this.setState({ errorMessage: 'Please enter contract address to search!!!' });
		}
		else {

		}

		this.setState({ loading: false });
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
					<Form error={!!this.state.errorMessage}>
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
						</Grid>
						<h4>Event list:</h4>
					</Form>

				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;
