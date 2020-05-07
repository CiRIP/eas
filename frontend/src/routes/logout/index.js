import { h, Component } from 'preact';
import { route } from 'preact-router';

class Logout extends Component {
	constructor(props) {
		super(props);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.mutate({
			variables: { credentials: {id: this.state.id, password: this.state.accessCode} }
		}).then(({data}) => {
			if(data.authenticate.jwtToken) sessionStorage.setItem('token', data.authenticate.jwtToken);
			console.log(data);
			route('/tasks');
		}).catch(err => console.error(err));
	}

	componentDidMount() {
		console.log('wow');
		sessionStorage.clear('token');
		route('/');
	}

	render() {
		return null;
	}
}

export default Logout;