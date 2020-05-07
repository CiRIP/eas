import { h } from 'preact';
import { Link } from 'preact-router/match';
import Loading from '../../components/loading';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const queryTasksList = gql`
{
	tasksList {
		id
		name
	}
}
`;

const TaskList = props => (
	<ul class="container mx-auto list-reset px-4">
		{props.children}
	</ul>
);

TaskList.Item = props => (
	<li>
		<Link class="flex items-center h-16 px-4 border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black" href={'/admin/tasks/' + props.id}>
			<span class="flex-1">
				<strong>{props.name}</strong>
			</span>
			<svg class="fill-current opacity-25 ml-8" height="24" width="13">
				<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
			</svg>
		</Link>
	</li>
);

const View = props => (

	<Query query={queryTasksList}>
		{({ loading, error, data }) => {
			if (loading) return <Loading dark />
			if (error) return <div>error.message</div>

			return (
				<div>
					<div class="container mx-auto list-reset px-4">
						<Link href="/admin/tasks/new" class="flex items-center h-16 px-8 border-b border-dotted border-indigo-lightest hover:bg-grey-lightest no-underline text-black">
							<svg width="16" height="16" fill-rule="evenodd" clip-rule="evenodd" class="mr-4 text-grey-darkest fill-current">
								<path d="M7 7v-7h1v7h7v1h-7v7h-1v-7h-7v-1h7z" />
							</svg>
							<span>Adaugă problemă</span>
						</Link>
					</div>
					<TaskList>{data.tasksList.map(e => <TaskList.Item name={e.name} id={e.id} />)}</TaskList>
				</div>
			);
		}}
	</Query>
)

export default View;
