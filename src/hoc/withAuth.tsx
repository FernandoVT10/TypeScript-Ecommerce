import React from "react";
import Router from "next/router";

import ApiController from "@/services/ApiController";

import LoginPage from "@/pages/login";

import FullScreenLoader from "@/components/FullScreenLoader";

import UserContext, { IUserContextProps } from "@/contexts/UserContext";

interface APIResponse {
    data: {
	user: IUserContextProps
    }
}

interface ComponentState {
    loading: boolean,
    user: IUserContextProps
}

const withAuth = <T extends object>(Component: React.ComponentType<T>) => {
    return class extends React.Component<T, ComponentState> {
	state = {
	    loading: true,
	    user: null
	}

	async componentDidMount() {
	    const apiResponse = await ApiController.get<APIResponse>("account/getUserData");

	    if(!apiResponse.data) {
		Router.replace("/login/");
		return this.setState({ loading: false });
	    }
	    
	    this.setState({
		user: apiResponse.data.user,
		loading: false
	    });
	}

	render() {
	    if(this.state.loading) return <FullScreenLoader/>;

	    if(!this.state.user) return <LoginPage activationStatus=""/>;

	    return (
		<UserContext.Provider value={this.state.user}>
		    <Component { ...this.props }/>
		</UserContext.Provider>
	    );
	}
    }
}

export default withAuth;
