import { h, Component } from 'preact';
import { route } from 'preact-router';
import { client } from '../../components/app';

class Logout extends Component {
	componentWillMount() {
		console.log('wow');
		sessionStorage.clear('token');
		client.cache.reset();
		route('/', true);
	}

	render() {
		return null;
	}
}

export default Logout;
