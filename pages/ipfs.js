import React, { Component } from 'react';
import { Card, Button, Image, Form, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';

const ipfsAPI = require('ipfs-api');

import { file } from '../utils/file';

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
                        <div>
                            <input type="file"
                                name="myFile"
                                onChange={this.onChange} />

                            <p></p>
                            <Button icon='cloud upload' loading={this.state.loading} color='red' onClick={this.uploadFile} />
                            <p></p>

                            <h4>After upload to IPFS, your image will be appeared here!!</h4>
                            {
                                this.state.imageId != '' ?
                                    <Image src={'https://ipfs.io/ipfs/' + this.state.imageId} size='large' rounded
                                        as='a'
                                        href={'https://ipfs.io/ipfs/' + this.state.imageId}
                                        target='_blank' /> : ''
                            }
                        </div>

                    </Form>
                </div>
            </Layout>
        );
    }

    onChange = async event => {
        event.preventDefault();

        this.setState({ selectedFile: event.target.files[0] });
    }

    uploadFile = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });

        try {
            file.readFileAsArrayBuffer(this.state.selectedFile, async (data) => {
                const buffer = Buffer.from(data);
                const id = await ipfs.files.add(buffer);
                this.setState({ imageId: id[0].hash });
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }
}

export default IpfsIndex;
