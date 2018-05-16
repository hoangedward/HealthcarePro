import { Grid } from 'semantic-ui-react';

const Pack1 = props => {
	return (
		<Grid columns='equal' divided>
			<Grid.Row>
				<Grid.Column width={10}>
					Fever
					</Grid.Column>
				<Grid.Column width={2}>
					100%
					</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Backache
					</Grid.Column>
				<Grid.Column width={2}>
					80%
					</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Stomach ache
					</Grid.Column>
				<Grid.Column width={2}>
					80%
					</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Toothache
					</Grid.Column>
				<Grid.Column width={2}>
					50%
					</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

const Pack2 = props => {
	return (
		<Grid columns='equal' divided>
			<Grid.Row>
				<Grid.Column width={10}>
					Fever
				</Grid.Column>
				<Grid.Column width={2}>
					100%
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Backache
				</Grid.Column>
				<Grid.Column width={2}>
					10%
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Stomach ache
				</Grid.Column>
				<Grid.Column width={2}>
					10%
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					Toothache
				</Grid.Column>
				<Grid.Column width={2}>
					80%
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					<strong>Cancer</strong>
				</Grid.Column>
				<Grid.Column width={2}>
					80%
				</Grid.Column>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={10}>
					<strong>General examination</strong>
				</Grid.Column>
				<Grid.Column width={2}>
					50%
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

module.exports.Pack1 = Pack1;
module.exports.Pack2 = Pack2;