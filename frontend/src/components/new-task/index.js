import { h, Component } from 'preact';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { route } from 'preact-router';

const mutationCreateTask = gql`
mutation newTask($task: TaskInput!) {
	createTask(input: {task: $task}) {
		task {
			id
		}
	}
}
`;

class NewTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			taskName: null
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
			variables: { task: {name: this.state.taskName, sourceName: ""} }
		}).then(({data}) => {
			route('/admin/tasks');
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
						NAME
						<input
							name="taskName"
							class="
								py-3 px-4 ml-2 w-login-input
								rounded-full rounded-l-none
								border border-indigo-lightest
								appearance-none text-base text-grey-darker leading-tight"
							type="text"
							autocomplete="off"
							value={this.state.taskName}
							onInput={this.handleInput}
							placeholder="adunare"
						/>
					</label>
					
					<div class="text-center mt-16">
						<input
							type="submit"
							value="Adaugă problemă"
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

const graphqlNewTask = graphql(mutationCreateTask)(NewTask);

export default graphqlNewTask;
