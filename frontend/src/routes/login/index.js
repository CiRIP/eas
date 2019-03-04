import { h, Component } from 'preact';
import style from './style';
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
			id: null,
			accessCode: null
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInput(e) {
		const target = e.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value.toUpperCase()
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.mutate({
			variables: { credentials: {id: this.state.id, password: this.state.accessCode} }
		}).then(({data}) => {
			if(data.authenticate.jwtToken) sessionStorage.setItem('token', data.authenticate.jwtToken);
			console.log(data);
			route('/tasks');
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
						<h1 class="text-2xl mb-2">Autentificare</h1>
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
						ID ELEV
						<input
							name="id"
							class="
								py-3 px-4 ml-2 w-login-input
								bg-grey-lightest
								rounded-full rounded-l-none
								border-none
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							value={this.state.id}
							onInput={this.handleInput}
							placeholder="BB_9_123"
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-darker
						rounded-full
						text-right text-indigo-lightest text-xs font-bold"
					>
						COD ACCES
						<input
							name="accessCode"
							class="
								py-3 px-4 ml-2 w-login-input
								bg-grey-lightest
								rounded-full rounded-l-none
								border-none
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.accessCode}
							onInput={this.handleInput}
							placeholder="ABCD-1234"
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