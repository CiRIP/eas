/* eslint-disable react/sort-comp */
import { h, Component, options } from 'preact';
import Header from '../../components/header';
import AppealList from '../../components/appeal-list';
import Loading from '../../components/loading';
import BrokenDocument from '../../components/broken-document';

import { Query, graphql } from "react-apollo";
import gql from "graphql-tag";
import { route } from 'preact-router';

const queryUserInfo = gql`
{
	currentUser {
		firstName
		lastName
		participationId
	}
}
`;

const querySubmissionsAndAppealReasonsList = gql`
{
	currentUser {
		submissionsList {
			id
			task {
				name
			}
			appeal {
				id
			}
		}
	}
	appealReasonsList {
		id
		title
		description
	}
}
`;

const mutationStartAppeal = gql`
mutation startAppeal($appeal: StartAppealInput!) {
	startAppeal(input: $appeal) {
		appeal {
			id
		}
	}
}
`;

class NewAppeal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submission: null,
			reason: null,
			detailed: null
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
			variables: {
				appeal: {
					submissionId: this.state.submission,
					reasonId: this.state.reason,
					detailed: this.state.detailed
				}
			}
		}).then(({ data }) => {
			console.log(data);
			route('/appeals/' + data.startAppeal.appeal.id);
		}).catch(err => console.error(err));
	}


	render() {
		return (
			<div>
				<header>
					<Query query={queryUserInfo}>
						{({ loading, error, data }) => {
							if (loading) return <Header.Main parent="/appeals"><Loading /></Header.Main>;
							if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} parent="/appeals" />;

							return <Header.Main title="Depune o contestație" subtitle={data.currentUser.participationId} parent="/appeals" />;
						}}
					</Query>
					<Header.Nav>
						<Header.Nav.Link href="/appeals/new">Formular</Header.Nav.Link>
					</Header.Nav>
				</header>

				<Query query={querySubmissionsAndAppealReasonsList}>
					{({ loading, error, data }) => {
						if (loading) return <Loading dark />;

						if (!data.currentUser.submissionsList || !data.currentUser.submissionsList.length) return (
							<div class="container flex flex-col items-center mx-auto list-reset px-4 py-16">
								<BrokenDocument />
								<h3>Nu poți depune contestație</h3>
								<p class="my-2">Nu ai nicio submisie pentru a contesta. </p>
								<h5 class="uppercase text-indigo-light text-xs my-6">Incearcă mai târziu...</h5>
							</div>
						);

						const appealable = data.currentUser.submissionsList.filter(e => e.appeal === null);

						if (!appealable || !appealable.length) return (
							<div class="container flex flex-col items-center mx-auto list-reset px-4 py-16">
								<BrokenDocument />
								<h3>Nu mai poți depune contestații</h3>
								<p class="my-2">Nu mai ai nicio submisie valabilă pentru a contesta. </p>
							</div>
						);

						return (
							<div class="w-full max-w-sm mx-auto p-4">
								<form class="w-full" onSubmit={this.handleSubmit}>
									<div class="p-4 border-b border-indigo-lightest no-underline w-full">
										<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="submission">
											Problemă contestată
										</label>
										<select
											name="submission"
											id="submission"
											class="
												block p-4 w-full rounded-none
												appearance-none text-base text-indigo-darker leading-tight"
											value={this.state.submission}
											onInput={this.handleInput}
											placeholder="Alege o problemă..."
											required
										>
											<option value="" disabled selected hidden>Alege o problemă...</option>
											{appealable.map(e => <option value={e.id}>{e.task.name}</option>)}
										</select>
									</div>
									<div class="p-4 border-b border-indigo-lightest no-underline w-full">
										<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="reason">
											Motiv contestație
										</label>
										<select
											name="reason"
											id="reason"
											class="
												block p-4 w-full rounded-none
												appearance-none text-base text-indigo-darker leading-tight"
											value={this.state.reason}
											onInput={this.handleInput}
											placeholder="Alege o problemă..."
											required
										>
											<option value="" disabled selected hidden>Alege un motiv...</option>
											{data.appealReasonsList.map(e => <option value={e.id}>{e.title}</option>)}
										</select>
										{ this.state.reason && <p class="p-4 italic text-grey">{ data.appealReasonsList.filter(e => e.id === this.state.reason)[0].description }</p> }
									</div>
									<div class="p-4 border-b border-indigo-lightest no-underline w-full">
										<label class="block py-2 mb-2 uppercase font-bold text-indigo-light text-xs" for="detailed">
											Detalii suplimentare
										</label>
										<textarea
											name="detailed"
											id="detailed"
											class="
												block p-4 w-full rounded-none
												appearance-none text-base text-indigo-darker leading-tight"
											value={this.state.detailed}
											onInput={this.handleInput}
											placeholder="Scrie aici..."
											required
										/>
									</div>
									<div class="text-center mt-16">
										<input
											type="submit"
											value="Trimite contestație"
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

						return <AppealList>{data.currentUser.appealsList.map(e => <AppealList.Item name={e.submission.task.name} id={e.id} score={e.submission.totalScore} reason={e.reason.title} status={e.status} />)}</AppealList>;
					}}
				</Query>
			</div>
		);
	}
}

const graphqlNewAppeal = graphql(mutationStartAppeal)(NewAppeal);

export default graphqlNewAppeal;
