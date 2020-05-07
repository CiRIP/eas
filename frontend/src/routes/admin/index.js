import { h, Component } from 'preact';
import { Router, route } from 'preact-router';
import Header from '../../components/header';
import UserList from '../../components/user-list';
import TaskListAdmin from '../../components/task-list-admin';
import NewUser from '../../components/new-user';
import NewTask from '../../components/new-task';

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

class Admin extends Component {
	componentWillMount() {
		const token = sessionStorage.getItem('token');
		if (!token) route('/admin/login', true);

		const parsed = JSON.parse(atob(token.split('.')[1]));
		if (parsed.role != "admin_authenticated") route('/admin/login', true);
		console.log(parsed);
	}

	render() {
		return (
			<div>
				<header>
					<Header.Main title="Panou de administrare" parent="/admin/users"/>
					<Header.Nav>
						<Header.Nav.Link href="/admin/users">Participanți</Header.Nav.Link>
						<Header.Nav.Link href="/admin/tasks">Probleme</Header.Nav.Link>
					</Header.Nav>
				</header>

				<Router>
					<UserList path="/admin/users" />
					<NewUser path="/admin/users/new" />
					<TaskListAdmin path="/admin/tasks" />
					<NewTask path="/admin/tasks/new" />
				</Router>
			</div>
		)
	}
}

export default Admin;
