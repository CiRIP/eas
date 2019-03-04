import { h } from 'preact';
import Header from '../../components/header';
import TaskList from '../../components/task-list';
import Loading from '../../components/loading';

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
			score {
				total
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
					if (loading) return <Header.Main><Loading /></Header.Main>;
					if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} />;

					return <Header.Main title={data.currentUser.firstName + ' ' + data.currentUser.lastName} subtitle={data.currentUser.participationId} />;
				}}
			</Query>
			<Header.Nav>
				<Header.Nav.Link href="/tasks">Probleme</Header.Nav.Link>
				<Header.Nav.Link href="/appeals">Contestații</Header.Nav.Link>
			</Header.Nav>
		</header>

		<Query query={queryTaskList}>
			{({ loading, error, data }) => {
				if (loading) return <Loading dark />

				return <TaskList>{data.currentUser.submissionsList.map(e => <TaskList.Item name={e.task.name} id={e.id} score={e.score.total} />)}</TaskList>
			}}
		</Query>
	</div>
)

export default Tasks;
