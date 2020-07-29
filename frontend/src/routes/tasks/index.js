import { h } from 'preact';
import Header from '../../components/header';
import TaskList from '../../components/task-list';
import Loading from '../../components/loading';
import BrokenDocument from '../../components/broken-document';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const queryUserInfo = gql`
{
	currentUser {
		firstName
		lastName
		participationId
	}
}
`;

const queryTaskList = gql`
{
	currentUser {
		submissionsList {
			id
			task {
				name
			}
			totalScore
			appeal {
				id
				resolution {
					id
				}
			}
		}
	}
}
`;

const Tasks = () => (
	<div>
		<header>
			<Query query={queryUserInfo}>
				{({ loading, error, data }) => {
					if (loading) return <Header.Main parent="/tasks"><Loading /></Header.Main>;
					if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} parent="/tasks" />;

					return <Header.Main title={data.currentUser.firstName + ' ' + data.currentUser.lastName} subtitle={data.currentUser.participationId} parent="/tasks" />;
				}}
			</Query>
			<Header.Nav>
				<Header.Nav.Link href="/tasks">Probleme</Header.Nav.Link>
				<Header.Nav.Link href="/appeals">Contestații</Header.Nav.Link>
			</Header.Nav>
		</header>

		<Query query={queryTaskList}>
			{({ loading, error, data }) => {
				if (loading) return <Loading dark />;

				if (!data.currentUser.submissionsList || !data.currentUser.submissionsList.length) return (
					<div class="container flex flex-col items-center mx-auto list-reset px-4 py-16">
						<BrokenDocument />
						<h3>Nu există rezultate</h3>
						<p class="my-2">Nu ai nicio submisie încă. </p>
						<h5 class="uppercase text-indigo-light text-xs my-6">Incearcă mai târziu...</h5>
					</div>
				);

				return <TaskList>{data.currentUser.submissionsList.map(e => <TaskList.Item name={e.task.name} id={e.id} score={e.totalScore} appealed={!!e.appeal} overruled={e.appeal && !!e.appeal.resolution} />)}</TaskList>
			}}
		</Query>
	</div>
)

export default Tasks;
