/* eslint-disable react/sort-comp */

import {
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import React, { Component } from 'react';
import ReactJsonView from 'react-json-view';

import * as backendMainApiRequests from '../../utilities/apiRequests/backendMainApiRequests';

import './UserAccountPage.css';

class UserAccountPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isError: '',
            fetchedUserAccountData: null,
        };
    }

    async getUserAccountData() {
        try {
            this.setState({
                isLoading: true,
            });

            const userAccountData =
                await backendMainApiRequests.getLoggedUserDetails();

            this.setState({
                isLoading: false,
                isError: '',
                fetchedUserAccountData: userAccountData,
            });
        } catch (error) {
            this.setState({
                isLoading: false,
                isError: error.customErrMsg || error.message,
            });
        }
    }

    componentDidMount() {
        this.getUserAccountData();
    }

    render() {
        const { isLoading, isError, fetchedUserAccountData } = this.state;

        if (isLoading) {
            return (
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            );
        }

        if (!isLoading && isError) {
            return (
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error Occurred</AlertTitle>
                    <AlertDescription>{isError}</AlertDescription>
                </Alert>
            );
        }

        return (
            <div className='UserAccountPage'>
                <h1>User Account</h1>
                <div>
                    <ReactJsonView src={fetchedUserAccountData} />
                </div>
            </div>
        );
    }
}

export default UserAccountPage;
