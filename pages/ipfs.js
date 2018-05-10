import React, { Component } from 'react';
import { Card, Button, Image, Form, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

const ipfsAPI = require('ipfs-api');

// Start ipfs local
// cd go-ipfs
// ipfs daemon
const ipfs = ipfsAPI({ host: 'localhost', port: '5001', protocol: 'http' });

class IpfsIndex extends Component {

    state = {
        selectedFile: {},
        errorMessage: '',
        loading: false,
        imageId: ''
    };

    render() {
        return (
            <Layout>
                <div>
                    <h3>Test IPFS</h3>
                    <Form error={!!this.state.errorMessage}>
                        <Message error header="Oops!" content={this.state.errorMessage} />

                        <input type="file"
                            name="myFile"
                            onChange={this.onChange} />

                        <Button circular icon='cloud upload' color='red' onClick={this.uploadFile} />

                        <p></p>

                        After upload to IPFS, your image will be appeared here!!
                        {
                            this.state.imageId != '' ?
                                <Image src={'https://ipfs.io/ipfs/' + this.state.imageId} size='small' rounded /> : ''
                        }

                    </Form>
                </div>
            </Layout>
        );
    }

    onChange = async event => {
        this.setState({ selectedFile: event.target.files[0] });
    }

    uploadFile = async event => {

        this.setState({ loading: true, errorMessage: '' });

        try {
            const reader = new window.FileReader();
            await reader.readAsBinaryString(this.state.selectedFile);

            const buffer = Buffer.from(reader.result);
            const id = await ipfs.files.add(buffer);
            // this.setState({ imageId: id.hash });
            this.setState({ imageId: 'QmStqeYPDCTbgKGUwns2nZixC5dBDactoCe1FB8htpmrt1' });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }
}

export default IpfsIndex;
