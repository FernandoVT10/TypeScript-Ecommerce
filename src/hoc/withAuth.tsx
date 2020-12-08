import React from "react";
import Router from "next/router";

import ApiController from "@/services/ApiController";

import LoginPage from "@/pages/login";

import FullScreenLoader from "@/components/FullScreenLoader";

interface APIResponse {
    data: {
	isLogged: boolean
    }
}

interface ComponentState {
    isLogged: boolean,
    loading: boolean
}

const withAuth = <T extends object>(Component: React.ComponentType<T>) => {
    return class extends React.Component<T, ComponentState> {
	state = {
	    isLogged: false,
	    loading: true
	}

	async componentDidMount() {
	    const apiResponse = await ApiController.get<APIResponse>("account/isLogged");

	    if(!apiResponse.data) {
		Router.replace("/login/");
		return this.setState({ loading: false });
	    }

	    if(!apiResponse.data.isLogged) {
		Router.replace("/login/");
	    }
	    
	    this.setState({
		isLogged: apiResponse.data.isLogged,
		loading: false
	    });
	}

	render() {
	    if(this.state.loading) return <FullScreenLoader/>;

	    if(!this.state.isLogged) return <LoginPage activationStatus=""/>;

	    return <Component { ...this.props }/>;
	}
    }
}

export default withAuth;
