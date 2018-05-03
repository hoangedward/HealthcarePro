import React, { Component } from 'react';
import { Form, Card, Message, Button, Checkbox, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Router } from '../../../routes';
import deployed_address from '../../../ethereum/deployed_address.json';
import Accounts from '../../../ethereum/const/Accounts.json';

class CampaignIndex extends Component {
    state = {
        errorMessage: '',
        loading: false,
        packId: '',
        period: ''
    }

    static async getInitialProps(props) {
        return {
            clinic_name: props.query.clinic_name
        };
    }

    onRegister = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            var clinicCategoryAddress = deployed_address['ClinicCategory'];
            var patientAddress = Accounts.Patient;
            var contractPIAddress = 'Retrieve from the selection on GUI';
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
    }

    onBack = async event => {
        event.preventDefault();
        Router.pushRoute('/patient/clinic/new');
    }

    render() {
        return(
            <Layout>
                <div>
                    <h3>Your contracts with '{this.props.clinic_name}'</h3>
                    <Form error={!!this.state.errorMessage}>
                        <Message error header="Oops!" content={this.state.errorMessage} />
                        <Card.Group>
                            <Card>
                                <Card.Content>
                                    <Card.Header>
                                        Select your choice:
                                    </Card.Header>
                                    <Card.Meta>
                                        <h4/>
                                        <Table>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Item 1" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Item 2" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Item 3" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Item 4" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Item 5" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                        <hr/>
                                    </Card.Meta>
                                    <Card.Description>
                                        <h4>Total price: 8 ETH</h4>
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
                    </Form>
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;