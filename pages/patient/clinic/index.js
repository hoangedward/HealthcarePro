import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

class CampaignIndex extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Your contracts with Clinic</h3>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
