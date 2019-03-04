import { h } from 'preact';
import style from './style';
import { Link } from 'preact-router/match';


import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = gql`
{
	currentUser {
		participationId
	}
}
`;

const Home = () => (
	<article>
		<div class="relative">
			<header class="bg-indigo-darkest bg-grid text-white px-8 pt-16 pb-24 mb-8 slanted" >
				<h1 class="text-5xl max-w-sm">Olimpiada municipală de informatică 2019</h1>
			</header>
			<div class="hero-button absolute text-center">
				<Link class="px-6 py-3 bg-indigo-dark hover:bg-indigo active:bg-indigo-darker shadow-md tems-center text-indigo-lightest font-bold no-underline leading-none rounded-full inline-flex" href="/tasks">
					Intră în cont
					<svg class="fill-current opacity-75 h-4 w-4 ml-2 -mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
				</Link>
			</div>
		</div>
		<p class="p-4 md:px-8">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec urna tortor, dignissim a ante non, aliquam gravida ante. Duis eleifend nulla eu odio fermentum, in laoreet felis dapibus. Nullam hendrerit quam elit, pellentesque varius quam bibendum in. Cras felis arcu, cursus eget placerat sed, cursus non dui. Nulla lobortis sapien varius, consectetur felis placerat, faucibus quam. Nam sed quam tincidunt, cursus enim vel, auctor sapien. Curabitur pulvinar nibh massa.
		</p>
		<p class="p-4 md:px-8">
			Mauris euismod tempus nibh, a elementum elit hendrerit id. Nunc faucibus, dolor nec luctus volutpat, quam nulla vehicula nulla, in tempus tellus elit a felis. Nullam in purus vel sapien ultricies venenatis sit amet non nunc. Nullam non suscipit quam, mattis pulvinar ante. Suspendisse eu tortor sed mauris malesuada posuere a vel ipsum. Donec ultricies a orci et sollicitudin. Morbi luctus nec orci eget viverra. Pellentesque magna neque, commodo sit amet suscipit a, vulputate ac dui.
		</p>
	</article>
);

export default Home;
