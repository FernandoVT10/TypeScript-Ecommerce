import React from "react";
import Router from "next/router";

import ApiController from "@/services/ApiController";

import LoginPage from "@/pages/login";

import FullScreenLoader from "@/components/FullScreenLoader";

import UserContext, { IUserContextProps } from "@/contexts/UserContext";

const PERMISSIONS = {
    "USER": 1,
    "ADMIN": 2,
    "SUPERADMIN": 3
}

interface APIResponse {
    data: {
	user: IUserContextProps
    }
}

interface ComponentState {
    loading: boolean,
    user: IUserContextProps
}

const withAuth = <T extends object>(Component: React.ComponentType<T>, permissions = "USER") => {
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

	    const { user } = apiResponse.data;

	    if(PERMISSIONS[user.permits] < PERMISSIONS[permissions]) {
		Router.push("/");
		return;
	    }
	    
	    this.setState({
		user,
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
