import React, { Component } from 'react';
import { Form, Card, Message, Button, Checkbox, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Router } from '../../../routes';

import deployed_address from '../../../ethereum/deployed_address.json';
import Accounts from '../../../ethereum/const/Accounts.json';

import ContractCPList from '../../../ethereum/ContractCPList';

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
            await ContractCPList.methods
                .createContract(
                    Accounts.Clinic,
                    Accounts.Patient,
                    deployed_address.ClinicCategory,
                    [2,4,6])
                .send({
                    from: Accounts.Patient,
                    gas: 4000000
                });
            // Go to the contracts list of Patient
            Router.pushRoute('/clinic');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onBack = async event => {
        event.preventDefault();
        Router.pushRoute('/patient/clinic/new');
    }

    render() {
        return(
            <Layout>
                <div>
                    <h3>Your contract with {this.props.clinic_name}</h3>
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
                                                        <Checkbox label="Fever" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        1 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Backache" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Stomach ache" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        2 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Toothache" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        3 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="Cancel" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        10 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <Checkbox label="General examination" />
                                                    </Table.Cell>
                                                    <Table.Cell textAlign='right'>
                                                        5 ETH
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                        <hr/>
                                    </Card.Meta>
                                    <Card.Description>
                                        <h4>Total price: 6 ETH</h4>
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