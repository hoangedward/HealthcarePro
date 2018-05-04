import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import web3 from '../../../ethereum/web3';

import ContractCPList from '../../../ethereum/ContractCPList';

import Accounts from '../../../ethereum/const/Accounts.json';

class CampaignIndex extends Component {

  static async getInitialProps(props) {
    const campaigns = await ContractCPList.methods.getPatientContracts(Accounts.Patient).call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Grid columns='equal' divided>
              <Grid.Row stretched>
                  <Grid.Column>
                      <Link route={`/patient/client/view/${address}`}>
                          <a>View Contract</a>
                      </Link>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    Valid
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
      </Layout>
    );
  }
}

export default CampaignIndex;
