import { h, Component } from 'preact';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { route } from 'preact-router';

const authQuery = gql`
mutation auth($credentials: AuthenticateInput!) {
	authenticate(input: $credentials) {
		jwtToken
	}
}
`;

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInput(e) {
		const target = e.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.mutate({
			variables: { credentials: {id: this.state.username, password: this.state.password} }
		}).then(({data}) => {
			if(data.authenticate.jwtToken) sessionStorage.setItem('token', data.authenticate.jwtToken);
			console.log(data);
			route('/admin');
		}).catch(err => console.error(err));
	}

	render() {
		return (
			<div class="
				absolute pin
				flex flex-col items-center justify-center
				bg-indigo-darkest
				text-white text-center"
			>
				<form class="w-full max-w-xs" onSubmit={this.handleSubmit}>
					<div class="mb-16">
						<h1 class="text-2xl mb-2">Autentificare administrator</h1>
						<span class="
							px-3 py-1
							rounded-full
							bg-indigo-darker
							text-indigo-lightest text-xs font-bold"
						>Olimpiada municipală de informatică</span>
					</div>

					<label class="
						block
						mb-4
						bg-indigo-darker
						rounded-full
						text-right text-indigo-lightest text-xs font-bold"
					>
						USERNAME
						<input
							name="username"
							class="
								py-3 px-4 ml-2 w-login-input
								bg-grey-lightest
								rounded-full rounded-l-none
								border-none
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							value={this.state.username}
							onInput={this.handleInput}
							placeholder="admin"
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-darker
						rounded-full
						text-right text-indigo-lightest text-xs font-bold"
					>
						PAROLĂ
						<input
							name="password"
							class="
								py-3 px-4 ml-2 w-login-input
								bg-grey-lightest
								rounded-full rounded-l-none
								border-none
								appearance-none text-base text-grey-darker leading-tight"
							type="password"
							autocomplete="off"
							value={this.state.password}
							onInput={this.handleInput}
							placeholder="********"
						/>
					</label>
					
					<div class="text-center mt-16">
						<input
							type="submit"
							value="Intră în cont"
							class="
								px-6 py-3
								rounded-full
								bg-indigo-dark hover:bg-indigo active:bg-indigo-darker
								shadow-md
								text-indigo-lightest font-bold leading-none"
						/>
					</div>
				</form>
			</div>
		);
	}
}

const graphqlLogin = graphql(authQuery)(Login);

export default graphqlLogin;
