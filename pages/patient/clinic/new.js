import React, { Component } from 'react';
import { Form, Button, Input, Message, Card, Image, List, Icon } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

class CampaignIndex extends Component {
    state = {
        errorMessage: ''
    };

    render() {
        return (
            <Layout>
            <div>
              <h3>New Contract with Clinic</h3>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Card.Group>
                        <Card>
                            <Card.Content>
                                <Card.Header>
                                    Family Clinic
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
                                <Link route={`/patient/clinic/register/FamilyClinic`}>
                                    <a>
                                        <Button content="Choose" color="olive" floated="right" />
                                    </a>
                                </Link>
                            </Card.Content>
                        </Card>
                        <Card>
                            <Card.Content>
                                <Card.Header>
                                    Home Clinic
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
                                <Link route={`/patient/clinic/register/HomeClinic`}>
                                    <a>
                                        <Button content="Choose" color="olive" floated="right" />
                                    </a>
                                </Link>
                            </Card.Content>
                        </Card>
                    </Card.Group>
                    <Link route="/patient/clinic">
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

export default CampaignIndex;