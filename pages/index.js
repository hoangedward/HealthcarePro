import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Where do you want to go?</h3>
          <Link route="/patient">
            <a>
              <Button basic color='red' content="Patient" />
            </a>
          </Link>
					<Link route="/clinic">
            <a>
              <Button basic color='green' content="Clinic" />
            </a>
          </Link>
					<Link route="/insurer">
            <a>
              <Button basic color='blue' content="Insurer" />
            </a>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
