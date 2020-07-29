import { Fragment, h, Component } from 'preact';
import Header from '../../components/header';
import Loading from '../../components/loading';
import SubmissionInfo from '../../components/submission-info';
import SubmissionSource from '../../components/submission-source';

import { Query, graphql } from "react-apollo";
import gql from "graphql-tag";
import { Link } from 'preact-router/match';
import AppealList from '../../components/appeal-list';

const queryAppeal = gql`
query Appeal($id: UUID!) {
	appeal(id: $id) {
		id
		reason {
			description
			title
		}
		comment
		detailed
		status
		submission {
			id
			task {
				name
			}
			totalScore
		}
		resolution {
			id
			task {
				name
			}
			totalScore
		}
		user {
			firstName
			lastName
			examCenter
			grade
		}
	}
}
`;

const updateAppeal = gql`
mutation updateAppeal($input: UpdateAppealInput!) {
	updateAppeal(input: $input) {
		user {
			id
		}
	}
}
`;

const appealStatuses = {
	PENDING: 'În așteptare',
	PROCESSING: 'În procesare',
	FINALIZED: 'Soluționată',
	REJECTED: 'Respinsă'
};

class AppealView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: null,
			comment: null
		};

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		const target = e.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	patch(name) {
		this.props.mutate({
			variables: {
				input: {
					id: this.props.id,
					patch: {
						[name]: this.state[name]
					}
				}
			}
		});
	}

	render() {
		return (
			<div>
				<Query query={queryAppeal} variables={{ id: this.props.id }}>
					{({ loading, error, data }) => {
						if (loading) return <Loading />;
						
						return (
							<ul class="container flex flex-row flex-wrap mx-auto list-reset p-4 text-indigo-darker">
								<li class="flex-0 md:flex-1 p-4 border-b border-indigo-lightest no-underline w-full">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Nume concurent</strong></div>
									<div class="py-2">{data.appeal.user.firstName + ' ' + data.appeal.user.lastName}</div>
								</li>
								<li class="flex-1 p-4 border-b border-indigo-lightest no-underline">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Clasă</strong></div>
									<div class="py-2">{data.appeal.user.grade}</div>
								</li>
								<li class="flex-1 p-4 border-b border-indigo-lightest no-underline">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Centru de examen</strong></div>
									<div class="py-2">{data.appeal.user.examCenter}</div>
								</li>
								<li class="flex-0 p-4 border-b border-indigo-lightest no-underline w-full">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Problemă contestată</strong></div>
									<Link class="flex items-center h-24 px-4 -mb-4 hover:bg-grey-lightest no-underline text-black" href={'/tasks/' + data.appeal.submission.id}>
										<span class="flex-1">
											<strong class={data.appeal.resolution ? 'line-through text-grey-darker font-normal' : null}>{data.appeal.submission.task.name}</strong>
											{!data.appeal.resolution ?
												<span class="p-2 ml-4 h-6 bg-indigo-lightest items-center text-indigo-light leading-none rounded-full inline-flex" role="alert">
													<span class="text-left text-xs flex-auto italic">Contestație depusă</span>
												</span>
												: null}
											{data.appeal.resolution ?
												<span class="p-2 ml-4 h-6 bg-grey-lighter items-center text-grey-dark leading-none rounded-full inline-flex" role="alert">
													<span class="text-left text-xs flex-auto italic">Contestație soluționată</span>
												</span>
												: null}
										</span>
										<div><span class={data.appeal.resolution ? 'line-through text-grey-darker text-2xl' : 'text-2xl font-bold'}>{data.appeal.submission.totalScore}</span><span class="text-sm opacity-25 ml-1">/100</span></div>
										<svg class="fill-current opacity-25 ml-8" height="24" width="13">
											<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
										</svg>
									</Link>
								</li>
								<li class="flex-0 md:flex-1 p-4 border-b border-indigo-lightest no-underline w-full">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Motiv contestație</strong></div>
									<div class="py-2"><strong>{data.appeal.reason.title}</strong> - {data.appeal.detailed}</div>
								</li>
								<li class="flex-1 p-4 border-b border-indigo-lightest no-underline">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Stare</strong></div>
									<div class="py-2">
										<select
											name="status"
											id="status"
											class="
												block p-4 w-full rounded-none
												appearance-none text-base text-indigo-darker leading-tight"
											value={this.state.status || data.appeal.status}
											onInput={this.handleInput}
											required
										>
											<option value="PENDING">În așteptare</option>
											<option value="PROCESSING">În procesare</option>
											<option value="FINALIZED">Soluționată</option>
											<option value="REJECTED">Respinsă</option>
										</select>
										<button onClick={() => this.patch("status")} class="py-2 mb-2 uppercase font-bold text-indigo-light text-xs">Salvează</button>
									</div>
								</li>
								{data.appeal.comment ?
									<li class="flex-1 p-4 border-b border-indigo-lightest no-underline">
										<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Comentarii</strong></div>
										<div class="py-2">
											<textarea
												name="comment"
												id="comment"
												class="
													block p-4 w-full rounded-none
													appearance-none text-base text-indigo-darker leading-tight"
												value={this.state.comment || data.appeal.comment}
												onInput={this.handleInput}
												placeholder="Scrie aici..."
												required
											/>
										</div>
										<button onClick={() => this.patch("comment")} class="py-2 mb-2 uppercase font-bold text-indigo-light text-xs">Salvează</button>
									</li>
									: null
								}
								{data.appeal.resolution ?
									<li class="flex-0 p-4 border-b border-indigo-lightest no-underline w-full">
										<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Rezultat contestație</strong></div>
										<Link class="flex items-center h-24 px-4 -mb-4 hover:bg-grey-lightest no-underline text-black" href={'/tasks/' + data.appeal.resolution.id}>
											<span class="flex-1">
												<strong>{data.appeal.resolution.task.name}</strong>
											</span>
											<div><span class="text-2xl font-bold">{data.appeal.resolution.totalScore}</span><span class="text-sm opacity-25 ml-1">/100</span></div>
											<svg class="fill-current opacity-25 ml-8" height="24" width="13">
												<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
											</svg>
										</Link>
									</li>
									: null
								}
							</ul>
						);
					}}
				</Query>
			</div>
		);
	}
}

const graphqlAppealView = graphql(updateAppeal)(AppealView);

export default graphqlAppealView;
