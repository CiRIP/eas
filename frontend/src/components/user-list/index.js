import { h } from 'preact';
import { Link } from 'preact-router/match';
import Loading from '../../components/loading';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const queryUsersList = gql`
{
	usersList {
		id
		firstName
		lastName
		grade
		participationId
		attendance
		submissionsList {
			score {
				total
			}
		}
	}
}
`;

const UserList = props => (
	<ul class="container mx-auto list-reset px-4">
		{props.children}
	</ul>
);

UserList.Item = props => (
	<li>
		<Link class="flex items-center h-16 px-4 border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black" href={'/admin/users/' + props.id}>
			<span class="flex-1">
				<strong class="mr-4"><code>{props.participationId}</code></strong>
				<span>{props.name}</span>
				{props.attendance ?
					<span class="p-2 mx-4 h-6 bg-green-lightest items-center text-green-light leading-none rounded-full inline-flex" role="info">
						<span class="text-left text-xs flex-auto italic">Prezent</span>
					</span>
					:
					<span class="p-2 mx-4 h-6 bg-red-lightest items-center text-red-light leading-none rounded-full inline-flex" role="info">
						<span class="text-left text-xs flex-auto italic">Absent</span>
					</span>
				}
			</span>
			<div><span class="font-bold">{props.score}</span></div>
			<svg class="fill-current opacity-25 ml-8" height="24" width="13">
				<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
			</svg>
		</Link>
	</li>
);

const View = props => (

	<Query query={queryUsersList} fetchPolicy='network-only'>
		{({ loading, error, data }) => {
			if (loading) return <Loading dark />
			if (error) return <div>error.message</div>

			return (
				<div>
					<div class="container mx-auto list-reset px-4">
						<Link href="/admin/users/new" class="flex items-center h-16 px-8 border-b border-dotted border-indigo-lightest hover:bg-grey-lightest no-underline text-black">
							<svg width="16" height="16" fill-rule="evenodd" clip-rule="evenodd" class="mr-4 text-grey-darkest fill-current">
								<path d="M7 7v-7h1v7h7v1h-7v7h-1v-7h-7v-1h7z" />
							</svg>
							<span>Adaugă participant</span>
						</Link>
					</div>
					<UserList>{data.usersList.map(e => <UserList.Item name={e.firstName + ' ' + e.lastName} id={e.id} participationId={e.participationId} attendance={e.attendance} score={e.submissionsList.reduce((acc, i) => acc + i.score.total, 0)} />)}</UserList>
				</div>
			);
		}}
	</Query>
)

export default View;
