import { Fragment, h } from 'preact';
import Header from '../../components/header';
import Loading from '../../components/loading';
import SubmissionInfo from '../../components/submission-info';
import SubmissionSource from '../../components/submission-source';

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from 'preact-router/match';

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

const appealStatuses = {
	PENDING: 'În așteptare',
	PROCESSING: 'În procesare',
	FINALIZED: 'Soluționată',
	REJECTED: 'Respinsă'
};

const TaskView = props => (
	<div>
		<Query query={queryAppeal} variables={{ id: props.id }}>
			{({ loading, error, data }) => {
				if (loading) return <Header.Main parent="/appeals"><Loading /></Header.Main>;
				if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} parent="/appeals" />;
				return (
					<Fragment>
						<header>
							<Header.Main title={'Contestație pentru ' + data.appeal.submission.task.name} subtitle={appealStatuses[data.appeal.status]} parent="/appeals" />
							<Header.Nav>
								<Header.Nav.Link href={'/appeals/' + props.id}>Detalii contestație</Header.Nav.Link>
							</Header.Nav>
						</header>
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
								<div class="py-2">{appealStatuses[data.appeal.status]}</div>
							</li>
							{ data.appeal.comment ?
								<li class="flex-1 p-4 border-b border-indigo-lightest no-underline">
									<div class="py-2"><strong class="uppercase text-indigo-light text-xs">Comentarii</strong></div>
									<div class="py-2">{data.appeal.comment}</div>
								</li>
								: null
							}
							{ data.appeal.resolution ?
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
					</Fragment>
				);
			}}
		</Query>
	</div>
);

export default TaskView;
