import React, { Component } from 'react';
import { Card, Button, Grid, Label, Form } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import web3 from '../../../ethereum/web3';
import { Cp } from '../../clinic/cp';

import ContractCPList from '../../../ethereum/ContractCPList';

import Accounts from '../../../ethereum/const/Accounts.json';

class CampaignIndex extends Component {

  async componentDidMount() {
    const campaigns = await ContractCPList.methods.getPatientContracts(Accounts.Patient).call();
    this.setState( { campaigns: campaigns, loading: false } );
  }

  state = {
    contractStatus: [],
    campaigns: [],
    loading: true
  };

  async getSummary(address) {
    let summary = await Cp.getSummary(address);
    var _contractStatus = this.state.contractStatus;
    _contractStatus[address] = summary[0];// status (int)
    this.setState({ contractStatus: _contractStatus });
  }

  renderCampaigns() {
    const items = this.state.campaigns.map(address => {
      this.getSummary(address);
      return {
        header: address,
        description: (
          <Grid columns='equal' divided>
            <Grid.Row stretched>
              <Grid.Column>
                <Link route={`/patient/clinic/view/${address}`}>
                  <a>View Contract</a>
                </Link>
              </Grid.Column>
              <Grid.Column width={3}>
                <Label color={Cp.renderStatusColor(this.state.contractStatus[address])}>{Cp.renderStatus(this.state.contractStatus[address])}</Label>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Form loading={this.state.loading}>
          <div>
            <h3>Your contracts with Clinic</h3>
            <Link route="/patient/clinic/new">
              <a>
                <Button
                  content="New Contract"
                  icon="add circle"
                  primary
                />
              </a>
            </Link>
            <Link route="/patient">
              <a>
                <Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
              </a>
            </Link>
            <p></p>
            {this.renderCampaigns()}
          </div>
        </Form>
      </Layout>
    );
  }
}

export default CampaignIndex;
