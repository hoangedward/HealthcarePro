import React, { Component } from 'react';
import { Form, Card, Message, Button, Checkbox, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Router } from '../../../routes';

import deployed_address from '../../../ethereum/deployed_address.json';
import Accounts from '../../../ethereum/const/Accounts.json';

import ContractCPList from '../../../ethereum/ContractCPList';

const items = {
    'FamilyClinic': [
        { id: 1, name: 'Fever', price: 1 },
        { id: 2, name: 'Backache', price: 2 },
        { id: 3, name: 'Stomach ache', price: 2 },
        { id: 4, name: 'Toothache', price: 3 }
    ],
    'HomeClinic': [
        { id: 1, name: 'Fever', price: 1 },
        { id: 2, name: 'Backache', price: 2 },
        { id: 3, name: 'Stomach ache', price: 2 },
        { id: 4, name: 'Toothache', price: 3 },
        { id: 5, name: 'Cancel', price: 10 },
        { id: 6, name: 'General examination', price: 5 }
    ]
};

class CampaignIndex extends Component {

    state = {
        errorMessage: '',
        loading: false,
        packId: '',
        period: '',
        totalPrice: 0,
        itemState: []
    }

    static async getInitialProps(props) {
        return {
            clinic_name: props.query.clinic_name
        };
    }

    getCheckedItem() {
        let checkedItems = [];
        items[this.props.clinic_name]
            .map(item => {
                if (this.state.itemState[item.name]) {
                    checkedItems.push(item.id);
                }
            }
            );
        return checkedItems;
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
                    this.getCheckedItem()
                )
                .send({
                    from: Accounts.Patient,
                    gas: 4000000
                });
            // Go to the contracts list of Patient
            Router.pushRoute('/patient/clinic');
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    onBack = async event => {
        event.preventDefault();
        Router.pushRoute('/patient/clinic/new');
    }

    renderTable() {
        let rows = items[this.props.clinic_name]
            .map(item => {
                return (
                    <Table.Row>
                        <Table.Cell>
                            <Checkbox label={item.name} onChange={this.itemChange(item.name, item.price)} checked={this.state.itemState[item.name]} />
                        </Table.Cell>
                        <Table.Cell textAlign='right'>
                            {item.price} ETH
                        </Table.Cell>
                    </Table.Row>
                );
            }
            );

        return <Table.Body children={rows} />
    }

    itemChange = (name, price) => async event => {
        event.preventDefault();

        let totalPrice = this.state.totalPrice;
        let itemState = this.state.itemState;

        itemState[name] = !itemState[name];

        if (itemState[name] == true) {
            totalPrice += price;
        }
        else {
            totalPrice -= price;
        }

        this.setState({ totalPrice: totalPrice, itemState: itemState });

    }

    render() {
        return (
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
                                        <h4 />
                                        {this.renderTable()}
                                        <hr />
                                    </Card.Meta>
                                    <Card.Description>
                                        <h4>Total price: {this.state.totalPrice} ETH</h4>
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