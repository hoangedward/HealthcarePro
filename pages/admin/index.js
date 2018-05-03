import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';

class CampaignIndex extends Component {

  render() {
    return (
      <Layout>
        <div>
          <h3>Administration Page</h3>
					
					<h4>Account Infomation</h4>
					<div class="ui segments">
						<div class="ui segment">
							<strong>Name: </strong> Admin
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
						</div>
						<div class="ui red segment">
							<strong>Name: </strong> Patient
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
						</div>
						<div class="ui blue segment">
							<strong>Name: </strong> Clinic
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
						</div>
						<div class="ui green segment">
							<strong>Name: </strong> Insurer
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
						</div>
					</div>
					
					<h4>Insurance Static Contracts</h4>
					<div class="ui segments">
						<div class="ui segment">
							<strong>Name: </strong> ContractPIList
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
							<Button content='Deploy' primary floated='right' />
						</div>
						<div class="ui red segment">
							<strong>Name: </strong> InsuranceCategory
							<br/>
							<strong>Address: </strong> 0x326ec2q3ecrv32c365
							<br/>
							<strong>Balance: </strong> 0.00 ETH
							<Button content='Deploy' primary floated='right' />
						</div>
						<div class="ui blue segment">
							<p>Middle</p>
						</div>
						<div class="ui green segment">
							<p>Middle</p>
						</div>
					</div>
					
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
