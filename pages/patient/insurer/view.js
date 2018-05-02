import React, { Component } from 'react';
import { Form, Button, Input, Message, Card, Image, List, Icon, Segment } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';

import ContractPI from '../../../ethereum/ContractPI';
import web3 from '../../../ethereum/web3';

class CampaignIndex extends Component {
	
	static async getInitialProps(props) {
    const contractPI = ContractPI(props.query.address);

    const summary = await contractPI.methods.getSummary().call();

    return {
      address: props.query.address,
			status: summary[0],
			patient: summary[1],
			insurer: summary[2],
			packId: summary[3],
			period: summary[4],
			totalContractValue: summary[5],
			startDate: summary[6],
			endDate: summary[7]
    };
  }
	
	state = {
		errorMessage: '',
		loading: false,
		buttonStatus: [true, true]
	};
	
	renderStatus() {
		var _status = "N/A";
		if(this.props.status == 0) {
				_status = "NEW";
		}
		
		return (
			_status
		);
	}
	
	renderPackName() {
		var _packName = "N/A";
		if(this.props.packId == 1) {
			_packName = "General Pack";
		}
		else if(this.props.packId == 2) {
			_packName = "Premium Pack";
		}
		return (_packName);
	}
	
	isEnableButton(name) {
		if(name == "confirm") {
			if(this.props.status == 0) {
				return true;
			}
			return false;
		}
		else if(name == "cancel") {
			if(this.props.status == 0) {
				return true;
			}
			return false;
		}
		
	}

  render() {
    return (
      <Layout>
				<h3>Insurance Contract Infomation</h3>
        <div>
					<Segment.Group>
						<Segment><strong>Contract Address: </strong>{this.props.address}</Segment>
						<Segment><strong>Status: </strong>{this.renderStatus()}</Segment>
						<Segment><strong>Patient Address: </strong>{this.props.patient}</Segment>
						<Segment><strong>Insurer Address: </strong>{this.props.insurer}</Segment>
						<Segment><strong>Pack Name: </strong>{this.renderPackName()}</Segment>
						<Segment><strong>Total Value: </strong>{this.props.totalContractValue}</Segment>
						<Segment><strong>Start Date: </strong>{this.props.startDate}</Segment>
						<Segment><strong>End Date: </strong>{this.props.endDate}</Segment>
					</Segment.Group>
					<div>
						<Button color='teal' disabled={!this.isEnableButton("confirm")} >Confirm</Button>
						<Button color='grey' disabled={!this.isEnableButton("cancel")} >Cancel</Button>
						<Link route="/patient/insurer">
							<a>
								<Button content='Back' icon='left arrow' labelPosition='left' floated='right' />
							</a>
						</Link>
					</div>
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
