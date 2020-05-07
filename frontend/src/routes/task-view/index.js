import { h } from 'preact';
import Header from '../../components/header';
import Loading from '../../components/loading';
import SubmissionInfo from '../../components/submission-info';
import SubmissionSource from '../../components/submission-source';

import { Query } from "react-apollo";
import gql from "graphql-tag";
import Router from 'preact-router';

const querySubmission = gql`
query Submission($id: UUID!) {
	submission(id: $id) {
		task {
			name
		}
		score {
			total
		}
	}
}
`;

const TaskView = props => (
	<div>
		<Query query={querySubmission} variables={{ id: props.id }}>
			{({ loading, error, data }) => {
				if (loading) return <Header.Main><Loading /></Header.Main>;
				if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} />;
				return (
					<header>
						<Header.Main title={data.submission.task.name} subtitle={[data.submission.score.total, <span class="opacity-50 font-normal"> /100</span>]} />
						<Header.Nav>
							<Header.Nav.Link href={'/tasks/' + props.id}>Detalii de evaluare</Header.Nav.Link>
							<Header.Nav.Link href={'/tasks/' + props.id + '/source'}>Sursă</Header.Nav.Link>
						</Header.Nav>
					</header>
				);
			}}
		</Query>
		<Router>
			<SubmissionInfo path="/tasks/:id" />
			<SubmissionSource path="/tasks/:id/source" />
		</Router>
	</div>
)

export default TaskView;
