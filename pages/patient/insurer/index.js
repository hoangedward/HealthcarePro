import React, { Component } from 'react';
import { Card, Button, Grid, Label } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import ContractPIList from '../../../ethereum/ContractPIList';
import web3 from '../../../ethereum/web3';

import Accounts from '../../../ethereum/const/Accounts.json';

import { Pi } from '../../../utils/pi';

class CampaignIndex extends Component {

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const campaigns = await
      ContractPIList.methods.getPatientContracts(Accounts.Patient).call();

    this.setState( { campaigns: campaigns } );
  }

  state = {
    contractStatus: [],
    campaigns: []
  };

  async getSummary(address) {
    let summary = await Pi.getSummary(address);
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
                <Link route={`/patient/insurer/view/${address}`}>
                  <a>View Contract</a>
                </Link>
              </Grid.Column>
              <Grid.Column width={3}>
                <Label size='medium' color={Pi.renderStatusColor(this.state.contractStatus[address])}>{Pi.renderStatus(this.state.contractStatus[address])}</Label>
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
        <div>
          <h3>Your contracts with Insurer</h3>
          <Link route="/patient/insurer/new">
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
      </Layout>
    );
  }
}

export default CampaignIndex;
