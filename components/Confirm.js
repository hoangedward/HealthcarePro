import { Button, Modal, Label } from 'semantic-ui-react';
import { eth } from '../utils/eth';

const ConfirmTransaction = props => {
  return (
    <Modal open={props.open} size='tiny'
		trigger={<Button color='teal' disabled={props.disabled} onClick={props.onClick}>{props.name}</Button>}
		closeOnRootNodeClick='false'>
		<Modal.Header>Confirm the transaction</Modal.Header>
		<Modal.Content>
			<p>Do you want to sumbit this transaction?</p>
			<p><strong>Amount: </strong>
				<Label color='violet'>
					{eth.fromWei(props.amount, 'ether')}
					<Label.Detail>ETH</Label.Detail>
				</Label>
			</p>
			<p>To Account: <strong>{props.toAccount}</strong></p>
		</Modal.Content>
		<Modal.Actions>
			<Button negative onClick={props.onNo}>No</Button>
			<Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={props.onYes} loading={props.loading} />
		</Modal.Actions>
	</Modal>
  );
};

const Confirm = props => {
  return (
    <Modal open={props.open} size='tiny'
		trigger={<Button color='grey' disabled={props.disabled} onClick={props.onClick}>{props.name}</Button>}
		closeOnRootNodeClick='false'>
		<Modal.Header>Confirm</Modal.Header>
		<Modal.Content>
			<p>Are you sure?</p>
		</Modal.Content>
		<Modal.Actions>
			<Button negative onClick={props.onNo}>No</Button>
			<Button positive labelPosition='right' icon='checkmark' content='Yes' onClick={props.onYes} loading={props.loading} />
		</Modal.Actions>
	</Modal>
  );
};

module.exports.ConfirmTransaction = ConfirmTransaction;
module.exports.Confirm = Confirm;