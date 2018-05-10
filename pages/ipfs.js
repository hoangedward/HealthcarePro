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
                                    <Image src={'https://ipfs.io/ipfs/' + this.state.imageId} size='large' rounded /> : ''
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
            this.readFileAsArrayBuffer(this.state.selectedFile, async (data) => {
                const buffer = Buffer.from(data);
                const id = await ipfs.files.add(buffer);
                this.setState({ imageId: id[0].hash });
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    }

    readFileAsArrayBuffer(file, success, error) {
        var fr = new FileReader();
        fr.addEventListener('error', error, false);
        if (fr.readAsBinaryString) {
            fr.addEventListener('load', function () {
                var string = this.resultString != null ? this.resultString : this.result;
                var result = new Uint8Array(string.length);
                for (var i = 0; i < string.length; i++) {
                    result[i] = string.charCodeAt(i);
                }
                success(result.buffer);
            }, false);
            return fr.readAsBinaryString(file);
        } else {
            fr.addEventListener('load', function () {
                success(this.result);
            }, false);
            return fr.readAsArrayBuffer(file);
        }
    }
}

export default IpfsIndex;
