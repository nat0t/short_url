import React from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';


class Form extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onFormChange(event);
    }

    handleSubmit(event) {
        this.props.onFormSubmit(event);
        event.preventDefault();
    }

    displayAlert(alertStatus) {
        if (alertStatus) {
            const error = this.props.handleBackendErrors();
            return <Alert variant="outlined" severity="error">
                {error}
            </Alert>
        }
    }

    render() {
        return (
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit} >
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <TextValidator
                                label="URL"
                                onChange={this.handleChange}
                                name="url"
                                placeholder="Input url for shortening"
                                value={this.props.formData.url}
                                validators={['required', 'matchRegexp:^http(s)?://.+$']}
                                errorMessages={['this field is required', 'URL is not valid']} />
                        </Grid>
                        <Grid item xs>
                            <TextValidator
                                label="Token"
                                onChange={this.handleChange}
                                name="token"
                                placeholder="Customize url with token"
                                value={this.props.formData.token}
                                validators={['maxStringLength:7',]}
                                errorMessages={['this field is too long',]} />
                        </Grid>
                        <Grid item xs>
                            <Button type="submit" variant="contained" color="primary" disabled={this.props.submitted}>
                                {
                                    (this.props.submitted && 'Requested!') || (!this.props.submitted && 'Get link!')
                                }
                            </Button>
                        </Grid>
                    </Grid>
                    { this.displayAlert(this.props.alertStatus) }
                </ValidatorForm>
        );
    }
}


export default Form;