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
			<div class="w-full max-w-sm mx-auto p-4">
				<form class="w-full" onSubmit={this.handleSubmit}>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="id">
							ID elev
						</label>
						<input
							name="id"
							id="id"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.id}
							onInput={this.handleInput}
							placeholder="BB_9_123"
							required
						/>
					</div>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="accessCode">
							Cod acces
						</label>
						<input
							name="accessCode"
							id="accessCode"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.accessCode}
							onInput={this.handleInput}
							placeholder="1234-TEST-04"
							required
						/>
					</div>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="lastName">
							Nume
						</label>
						<input
							name="lastName"
							id="lastName"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.lastName}
							onInput={this.handleInput}
							placeholder="Popescu"
							required
						/>
					</div>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="firstName">
							Prenume
						</label>
						<input
							name="firstName"
							id="firstName"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.firstName}
							onInput={this.handleInput}
							placeholder="Ionuț"
							required
						/>
					</div>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="grade">
							Clasa
						</label>
						<input
							name="grade"
							id="grade"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="number"
							min="9"
							max="12"
							autocomplete="off"
							value={this.state.grade}
							onInput={this.handleInput}
							placeholder={11}
							required
						/>
					</div>
					<div class="p-4 border-b border-indigo-lightest no-underline w-full">
						<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="examCenter">
							Centru de examen
						</label>
						<input
							name="examCenter"
							id="examCenter"
							class="
								block p-4 w-full rounded-none
								appearance-none text-base text-indigo-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.examCenter}
							onInput={this.handleInput}
							placeholder="Acasă"
							required
						/>
					</div>
					
					<div class="text-center mt-16">
						<input
							type="submit"
							value="Adaugă participant"
							class="
								px-6 py-3
								rounded-full
								bg-indigo-dark hover:bg-indigo active:bg-indigo-darker
								shadow-md
								text-white font-bold leading-none"
						/>
					</div>
				</form>
			</div>
		);
	}
}

const graphqlNewUser = graphql(mutationRegisterUser)(NewUser);

export default graphqlNewUser;
