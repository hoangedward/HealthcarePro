import React, { Component } from 'react';
import { Form, Button, Message, Card, List } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Router } from '../../../routes';

import ContractPIList from '../../../ethereum/ContractPIList';
import web3 from '../../../ethereum/web3';
import deployed_address from '../../../ethereum/deployed_address.json';
import Accounts from '../../../ethereum/const/Accounts.json';

class CampaignIndex extends Component {

	static async getInitialProps(props) {
		return {pack: props.query.pack};
	}

	async componentDidMount() {
		var _packId = '';
		var _period = '';
		if (this.props.pack == "pack1_6months") {
			_packId = '1';
			_period = '6';
		}
		else if (this.props.pack == "pack1_12months") {
			_packId = '1';
			_period = '12';
		}
		else if (this.props.pack == "pack2_6months") {
			_packId = '2';
			_period = '6';
		}
		else if (this.props.pack == "pack2_12months") {
			_packId = '2';
			_period = '12';
		}
		this.setState( {
			pack: this.props.pack,
			packId: _packId,
			period: _period
		} );
	}

	renderInsuranceInformation() {

		var packName = "";
		var periodName = "";
		var price = "";
		var item = "";
		if (this.state.pack == "pack1_6months") {
			packName = "General Pack";
			price = "20.00 ETH";
			item = (
				<div>
					<List bulleted>
						<List.Item>Fever</List.Item>
						<List.Item>Backache</List.Item>
						<List.Item>Stomach ache</List.Item>
						<List.Item>Toothache</List.Item>
					</List>
				</div>
			);
		}
		else if (this.state.pack == "pack1_12months") {
			packName = "General Pack";
			price = "30.00 ETH";
			item = (
				<div>
					<List bulleted>
						<List.Item>Fever</List.Item>
						<List.Item>Backache</List.Item>
						<List.Item>Stomach ache</List.Item>
						<List.Item>Toothache</List.Item>
					</List>
				</div>
			);
		}
		else if (this.state.pack == "pack2_6months") {
			packName = "Premium Pack";
			price = "30.00 ETH";
			item = (
				<div>
					<List bulleted>
						<List.Item>Fever</List.Item>
						<List.Item>Backache</List.Item>
						<List.Item>Stomach ache</List.Item>
						<List.Item>Toothache</List.Item>
						<List.Item>Cancer</List.Item>
						<List.Item>General examination</List.Item>
					</List>
				</div>
			);
		}
		else if (this.state.pack == "pack2_12months") {
			packName = "Premium Pack";
			price = "40.00 ETH";
			item = (
				<div>
					<List bulleted>
						<List.Item>Fever</List.Item>
						<List.Item>Backache</List.Item>
						<List.Item>Stomach ache</List.Item>
						<List.Item>Toothache</List.Item>
						<List.Item>Cancer</List.Item>
						<List.Item>General examination</List.Item>
					</List>
				</div>
			);
		}

		return (
			<Card.Group>
				<Card>
					<Card.Content>
						<Card.Header>
							{packName}
						</Card.Header>
						<Card.Meta>
							{periodName}
						</Card.Meta>
						<Card.Description>
							<h4>{price}</h4>
							{item}
						</Card.Description>
					</Card.Content>
					<Card.Content extra>
						<div>
							<Button primary onClick={this.onRegister} loading={this.state.loading}>Register</Button>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' onClick={this.onBack} />
						</div>
					</Card.Content>
				</Card>
			</Card.Group>
		);
	}

	onRegister = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		try {

			await ContractPIList.methods
				.createContract(Accounts.Insurer, Accounts.Patient, this.state.packId, this.state.period, deployed_address.InsuranceCategory)
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

	onBack = async event => {
		event.preventDefault();
		Router.pushRoute('/patient/insurer/new');
	};

	state = {
		errorMessage: '',
		loading: false,
		packId: '',
		period: ''
	};

	render() {
		return (
			<Layout>
				<div>
					<h3>Please confirm your registration</h3>
					<Form error={!!this.state.errorMessage}>
						<Message error header="Oops!" content={this.state.errorMessage} />

						{this.renderInsuranceInformation()}

					</Form>
				</div>
			</Layout>
		);
	}
}

export default CampaignIndex;
