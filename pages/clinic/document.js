import React, { Component } from 'react';
import { Form, Button, Message, Segment, Label, Image, Grid } from 'semantic-ui-react';
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
import { file } from '../../utils/file';

const ipfsAPI = require('ipfs-api');

// Start ipfs local
// cd go-ipfs
// ipfs daemon
const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

class ClinicDocumentIndex extends Component {

	static async getInitialProps(props) {
		return { address: props.query.address };
	}

	async componentDidMount() {
		const document = await Cp.getDocument(this.props.address);
		// For test
		//this.setState({ document: 'QmStqeYPDCTbgKGUwns2nZixC5dBDactoCe1FB8htpmrt1' });
		this.setState({ document: document });
	}

	state = {
		readyUpload: false,
		errorMessage: '',
		loading: false,
		selectedFile: [],
		document: ''
	};

	onChange = async event => {
		event.preventDefault();

		this.setState({ selectedFile: event.target.files[0], readyUpload: true });
	}

	uploadFile = async event => {
		event.preventDefault();

		this.setState({ loading: true, errorMessage: '' });

		try {
			file.readFileAsArrayBuffer(this.state.selectedFile, async (data) => {
				const buffer = Buffer.from(data);
				const id = await ipfs.files.add(buffer);
				await Cp.setDocument(this.props.address, id[0].hash);
				this.setState({ loading: false, document: id[0].hash });
			});
		} catch (err) {
			this.setState({ errorMessage: err.message });
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<Layout>
				<h3>Clinic Document</h3>
				<Form error={!!this.state.errorMessage}>
					<Message error header="Oops!" content={this.state.errorMessage} />
					<div>
						<Grid columns='equal' divided>
							<Grid.Row stretched>
								<Grid.Column>
									<input type="file"
										accept='image/*'
										name="myFile"
										onChange={this.onChange} />
								</Grid.Column>
								<Grid.Column width={1}>
									<Button icon='cloud upload' loading={this.state.loading} color='red' 
									disabled={!this.state.readyUpload} onClick={this.uploadFile} />
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<Segment.Group>
							<Segment>
								{
									this.state.document != '' ?
										<Image src={'https://ipfs.io/ipfs/' + this.state.document} size='large' rounded
											as='a'
											href={'https://ipfs.io/ipfs/' + this.state.document}
											target='_blank' /> : ''
								}
							</Segment>
						</Segment.Group>
					</div>

					<p></p>

					<div>
						<Link route={`/clinic/view/${this.props.address}`}>
							<a>
								<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
							</a>
						</Link>
					</div>
				</Form>
			</Layout>
		);
	}
}

export default ClinicDocumentIndex;
