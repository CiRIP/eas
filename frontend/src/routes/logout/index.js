import { h, Component } from 'preact';
import { route } from 'preact-router';

class Logout extends Component {
	componentWillMount() {
		console.log('wow');
		sessionStorage.clear('token');
		route('/', true);
	}

	render() {
		return null;
	}
}

export default Logout;
