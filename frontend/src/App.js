import React, { Component } from "react";
import './App.css';
import "@fontsource/roboto";
import axios from 'axios';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Form from "./components/Form.js";
import ShorterList from "./components/ShorterList.js";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'shorterList': [],
            'formData': {
                'token': '',
                'url': '',
            },
            'submitted': false,
            'error': {
                'status': '',
                'response': '',
            },
        };
        this.itemsPerPage = 5;
        this.backendAddress = 'http://localhost:8000/';
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleBackendErrors = this.handleBackendErrors.bind(this);
    }

    loadData() {
        axios
            .get(this.backendAddress + 'api/shorters/')
            .then(response => {
                this.setState(
                { 'shorterList': response.data }
                );
            }).catch(error => {
                console.log(error);
        });
    }

    componentDidMount() {
        this.loadData();
    }

    handleFormChange(event) {
        const formData = this.state.formData;
        formData[event.target.name] = event.target.value;
        this.setState(
            { formData },
        );
    }

    handleFormSubmit() {
        this.setState(
            { 'submitted': true },
            () => {
                setTimeout(() => this.setState({ 'submitted': false }), 5000);
            }
        );
        axios
            .post(this.backendAddress + 'api/shorters/', {
                "token": this.state.formData.token,
                "long_url": this.state.formData.url,
            }).then(response => {
                this.setState({
                    'formData': {
                        'token': '',
                        'url': '',
                    },
                });
                this.loadData();
            }).catch(error => {
                this.setState(
                    { 'error': { 'status': true, 'response': error.response } },
                    () => {
                        setTimeout(() => this.setState({ 'error': { 'status': false } }), 5000);
                    }
                );
                this.handleBackendErrors();
        });
    }

    handleBackendErrors() {
        let result = '';
        switch(this.state.error.response.status) {
            case 400:
                if (this.state.error.response.data.token.includes('shorter with this token already exists.')) {
                    result = 'The specified token already exists. Specify another token.';
                }
                break;
            default:
                break;
        }
        return result;
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="md">
                    <Form
                        onFormSubmit={this.handleFormSubmit}
                        onFormChange={this.handleFormChange}
                        formData={this.state.formData}
                        submitted={this.state.submitted}
                        alertStatus={this.state.error.status}
                        handleBackendErrors={this.handleBackendErrors} />
                    <ShorterList
                        shorterList={this.state.shorterList}
                        itemsPerPage={this.itemsPerPage}
                        backendAddress={this.backendAddress} />
                </Container>
            </React.Fragment>
        );
    }
}

export default App;
