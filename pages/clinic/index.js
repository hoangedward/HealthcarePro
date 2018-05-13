import React, { Component } from 'react';
import { Card, Button, Grid, Label } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

import ContractCPList from '../../ethereum/ContractCPList';
import web3 from '../../ethereum/web3';

import Accounts from '../../ethereum/const/Accounts.json';

import { Cp } from './cp';

class CampaignIndex extends Component {

  static async getInitialProps() {
    const accounts = await web3.eth.getAccounts();
    const campaigns = await
      ContractCPList.methods.getClinicContracts(Accounts.Clinic).call();

    return { campaigns };
  }

  state = {
    contractStatus: []
  };

  async getSummary(address) {
    let summary = await Cp.getSummary(address);
    var _contractStatus = this.state.contractStatus;
    _contractStatus[address] = summary[0];// status (int)
    this.setState({ contractStatus: _contractStatus });
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      this.getSummary(address);
      return {
        header: address,
        description: (
          <Grid columns='equal' divided>
            <Grid.Row stretched>
              <Grid.Column>
                <Link route={`/clinic/view/${address}`}>
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
        <div>
          <h3>Your contracts with Patient</h3>
          <Link route="/">
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
