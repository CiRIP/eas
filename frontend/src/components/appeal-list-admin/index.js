/* eslint-disable react/display-name */
import { h } from 'preact';
import { Link } from 'preact-router/match';
import Loading from '../../components/loading';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const queryAppealsList = gql`
{
	appealsList {
		id
		status
		reason {
			title
		}
		submission {
			task {
				name
			}
		}
		user {
			participationId
		}
	}
}
`;

const AppealList = props => (
	<ul class="container mx-auto list-reset px-4">
		{props.children}
	</ul>
);

const appealStatuses = {
	PENDING: (
		<span class="p-2 mx-4 h-6 bg-yellow-lightest items-center text-yellow-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">În așteptare</span>
		</span>
	),
	PROCESSING: (
		<span class="p-2 mx-4 h-6 bg-orange-lightest items-center text-orange-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">În procesare</span>
		</span>
	),
	FINALIZED: (
		<span class="p-2 mx-4 h-6 bg-green-lightest items-center text-green-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">Soluționată</span>
		</span>
	),
	REJECTED: (
		<span class="p-2 mx-4 h-6 bg-red-lightest items-center text-red-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">Respinsă</span>
		</span>
	)
};

AppealList.Item = props => (
	<li>
		<Link class="flex items-center h-16 px-4 border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black" href={'/appeals/' + props.id}>
			<div class="mr-4"><strong><code>{props.participationId}</code></strong></div>
			<div class="mr-4"><strong>{props.name}</strong></div>
			<div class="text-sm opacity-25 mt-1 flex-1">{props.reason}</div>

			{appealStatuses[props.status]}
			<svg class="fill-current opacity-25 ml-8" height="24" width="13">
				<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
			</svg>
		</Link>
	</li>
);

const View = props => (

	<Query query={queryAppealsList} fetchPolicy="network-only">
		{({ loading, error, data }) => {
			if (loading) return <Loading dark />
			if (error) return <div>{error.message}</div>

			return <AppealList>{data.appealsList.map(e => <AppealList.Item name={e.submission.task.name} id={e.id} participationId={e.user.participationId} status={e.status} reason={e.reason.title} />)}</AppealList>;
		}}
	</Query>
);

export default View;
