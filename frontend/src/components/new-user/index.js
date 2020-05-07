import { h, Component } from 'preact';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { route } from 'preact-router';

const mutationRegisterUser = gql`
mutation registerUser($user: RegisterUserInput!) {
	registerUser(input: $user) {
		user {
			id
		}
	}
}
`;

class NewUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			accessCode: null,
			firstName: null,
			lastName: null,
			grade: null,
			examCenter: null,
			attendance: null
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
			variables: { user: {participationId: this.state.id, firstName: this.state.firstName, lastName: this.state.lastName, grade: +this.state.grade, examCenter: this.state.examCenter, attendance: true, accessCode: this.state.accessCode} }
		}).then(({data}) => {
			route('/admin/users');
		}).catch(err => console.error(err));
	}

	render() {
		return (
			<div class="
				flex flex-col items-center justify-center text-center"
			>
				<form class="w-full max-w-xs py-16" onSubmit={this.handleSubmit}>

					<label class="
						block
						mb-4
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						ID ELEV
						<input
							name="id"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
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
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						COD ACCES
						<input
							name="accessCode"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.accessCode}
							onInput={this.handleInput}
							placeholder="ABCD-1234"
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						NUME
						<input
							name="lastName"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.lastName}
							onInput={this.handleInput}
							placeholder="Popescu"
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						PRENUME
						<input
							name="firstName"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.firstName}
							onInput={this.handleInput}
							placeholder="Ionuț"
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						CLASA
						<input
							name="grade"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.grade}
							onInput={this.handleInput}
							placeholder={11}
						/>
					</label>

					<label class="
						block
						mb-4
						bg-indigo-lightest
						rounded-full
						text-right text-indigo-black text-xs font-bold"
					>
						CENTRU
						<input
							name="examCenter"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.examCenter}
							onInput={this.handleInput}
							placeholder="Acasă"
						/>
					</label>
					
					<div class="text-center mt-16">
						<input
							type="submit"
							value="Adaugă participant"
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

const graphqlNewUser = graphql(mutationRegisterUser)(NewUser);

export default graphqlNewUser;
