import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import web3 from '../../../ethereum/web3';

class CampaignIndex extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Your contracts with Clinic</h3>
        </div>
        <div>
        	First test page!
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
