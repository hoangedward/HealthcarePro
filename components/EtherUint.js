import React from 'react';
import { Label } from 'semantic-ui-react';
import { eth } from '../utils/eth';

export default props => {
	let color = props.color || 'green';
	let value = props.value || '0';
	let fromUint = props.fromUint || 'wei';
	let toUint = props.toUint || 'ether';
  return (
    <Label color={color}>
			{fromUint == toUint ? value :
				fromUint == 'wei' ? eth.fromWei(props.value, 'ether') : eth.toWei(props.value, 'ether')
			}
			<Label.Detail>
				{toUint == 'wei' ? ' WEI' : ' ETH'}	
			</Label.Detail>
		</Label>
  );
};