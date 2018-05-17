import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

class HomeIndex extends Component {

  state = {
    loading: false
  };

  defaultOnClick = async event => {
    event.preventDefault(); this.setState({ loading: true});
  };

  render() {
    return (
      <Layout>
        <Form loading={this.state.loading}>
        <div>
          <h3>Where do you want to go?</h3>
          <Link route="/patient">
            <a>
              <Button basic color='red' content="Patient" onClick={this.defaultOnClick} />
            </a>
          </Link>
          <Link route="/clinic">
            <a>
              <Button basic color='green' content="Clinic" onClick={this.defaultOnClick} />
            </a>
          </Link>
          <Link route="/insurer">
            <a>
              <Button basic color='blue' content="Insurer" onClick={this.defaultOnClick} />
            </a>
          </Link>
        </div>
        </Form>
      </Layout>
    );
  }
}

export default HomeIndex;
