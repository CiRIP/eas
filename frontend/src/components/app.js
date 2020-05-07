import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { API_URL } from '../config.js';

const httpLink = createHttpLink({
	uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
	const token = sessionStorage.getItem('token');
	
	return {
		headers: token ? {
			...headers,
			authorization: `Bearer ${token}`
		} : { ...headers }
	}
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

// Code-splitting is automated for routes
import Home from '../routes/home';
import Tasks from '../routes/tasks';
import TaskView from '../routes/task-view';
import Login from '../routes/login';
import Logout from '../routes/logout';
import Appeals from '../routes/appeals';
import Admin from '../routes/admin';
import AdminLogin from '../routes/admin-login';

import Redirect from './redirect';


export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
		switch (e.url) {
			case '/': break;
			case '/login': break;
			case '/admin/login': break;
			case '/admin': break;
			case '/admin/users': break;
			default: if (!sessionStorage.getItem('token')) route('/login', true);
		}
	};

	render() {
		return (
			<ApolloProvider client={client}>
				<main>
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Tasks path="/tasks" />
						<TaskView path="/tasks/:id/:?" />
						<Appeals path="/appeals" />
						<AdminLogin path="/admin/login" />
						<Redirect path="/admin" to="/admin/users" />
						<Admin path="/admin/:?/:?" />
						<Login path="/login" />
						<Logout path="/logout" />
					</Router>
				</main>
			</ApolloProvider>
		);
	}
}
