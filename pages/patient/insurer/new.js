import React, { Component } from 'react';
import { Form, Button, Message, Card, List } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

class PatientInsurerNewIndex extends Component {

	async componentDidMount() {
		this.setState( { loading: false } );
	  }

	state = {
		errorMessage: '',
		loading: true
	};

	render() {
		return (
			<Layout>
				<div>
					<h3>New Contract with Insurer</h3>
					<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} loading={this.state.loading}>

						<Card.Group>
							<Card>
								<Card.Content>
									<Card.Header>
										General Pack
									</Card.Header>
									<Card.Meta>
										We share with you
									</Card.Meta>
									<Card.Description>
										<List bulleted>
											<List.Item>Fever</List.Item>
											<List.Item>Backache</List.Item>
											<List.Item>Stomach ache</List.Item>
											<List.Item>Toothache</List.Item>
										</List>
									</Card.Description>
								</Card.Content>
								<Card.Content extra>
									<Button.Group fluid>
										<Link route={`/patient/insurer/register/pack1_6months`}>
											<a>
												<Button animated='fade' color='teal'>
													<Button.Content visible>6 Months</Button.Content>
													<Button.Content hidden>
														20.00 ETH
													</Button.Content>
												</Button>
											</a>
										</Link>
										<Button.Or />
										<Link route={`/patient/insurer/register/pack1_12months`}>
											<a>
												<Button animated='fade' color='olive'>
													<Button.Content visible>1 Year</Button.Content>
													<Button.Content hidden>
														30.00 ETH
													</Button.Content>
												</Button>
											</a>
										</Link>
									</Button.Group>
								</Card.Content>
							</Card>
							<Card>
								<Card.Content>
									<Card.Header>
										Premium Pack
									</Card.Header>
									<Card.Meta>
										You are all covered
									</Card.Meta>
									<Card.Description>
										<List bulleted>
											<List.Item>Fever</List.Item>
											<List.Item>Backache</List.Item>
											<List.Item>Stomach ache</List.Item>
											<List.Item>Toothache</List.Item>
											<List.Item>Cancer</List.Item>
											<List.Item>	General examination</List.Item>
										</List>
									</Card.Description>
								</Card.Content>
								<Card.Content extra>
									<Button.Group fluid>
										<Link route={`/patient/insurer/register/pack2_6months`}>
											<a>
												<Button animated='fade' color='teal'>
													<Button.Content visible>6 Months</Button.Content>
													<Button.Content hidden>
														30.00 ETH
													</Button.Content>
												</Button>
											</a>
										</Link>
										<Button.Or />
										<Link route={`/patient/insurer/register/pack2_12months`}>
											<a>
												<Button animated='fade' color='olive'>
													<Button.Content visible>1 Year</Button.Content>
													<Button.Content hidden>
														40.00 ETH
													</Button.Content>
												</Button>
											</a>
										</Link>
									</Button.Group>
								</Card.Content>
							</Card>
						</Card.Group>
						<Link route="/patient/insurer">
							<a>
								<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
							</a>
						</Link>
						<Message error header="Oops!" content={this.state.errorMessage} />
					</Form>
				</div>
			</Layout>
		);
	}
}

export default PatientInsurerNewIndex;
