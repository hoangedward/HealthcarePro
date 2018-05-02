import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

class CampaignIndex extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Please choose operation</h3>
					<Link route="/patient/clinic">
            <a>
              <Button basic color='green' content="Your Clinic" />
            </a>
          </Link>
					<Link route="/patient/insurer">
            <a>
              <Button basic color='blue' content="Your Insurer" />
            </a>
          </Link>
					<Link route="/">
						<a>
							<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
						</a>
					</Link>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
