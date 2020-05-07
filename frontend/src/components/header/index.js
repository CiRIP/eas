import { h } from 'preact';
import { Link, Match } from 'preact-router/match';

const Header = {};

Header.Main = props => (
	<div class="
		flex flex-col items-center justify-center
		w-full h-64
		bg-indigo-darkest
		text-white text-center"
	>
		<Match path="/">
			{({ matches, path, url }) => (
				<div style="top: 0;" class="
					absolute container mx-auto h-16
					border-b border-indigo-black
					flex flex-row items-center justify-between"
				>
					<Link href="/tasks">
						<div class="text-sm w-16">
							{path == '/tasks' || path == '/tasks/' ? null :
							<svg class="fill-current ml-8 align-middle" viewBox="0 0 16 16" height="16">
								<polyline fill="none" stroke="white" points="12,0 4,8 12,16" />
							</svg>}
						</div>
					</Link>
					<div class="font-black">EAS Demo</div>
					<Link href="/logout">
						<div class="w-16">
							<svg class="fill-current mr-8 align-middle" viewBox="0 0 16 16" height="16">
								<polyline fill="none" stroke="white" strokeWidth="2" points="16,4 16,0 0,0 0,16 16,16 16,12" />
								<polyline fill="none" stroke="white" strokeWidth="1" points="4,8 15,8" />
								<polyline fill="none" stroke="white" strokeWidth="1" points="11,4 15,8 11,12" />
							</svg>
						</div>
					</Link>
				</div>
			)}
		</Match>
		<div class="font-bold text-2xl mb-2 mt-16">{props.title}</div>
		{props.subtitle ?
			<span class="
				rounded-full
				bg-indigo-darker
				text-indigo-lightest text-xs font-bold
				px-3 py-1"
			>{props.subtitle}</span>
		: null}
		{props.button ?
			<div class="
				inline-flex items-center
				rounded-full
				p-2 mt-16 h-8
				bg-indigo-darker
				text-indigo-lightest leading-none"
			>
				<span class="font-semibold mx-2 text-left text-sm flex-auto">{props.button}</span>
				<svg class="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
			</div>
		: null}
		{props.children}
	</div>
)

Header.Nav = props => (
	<nav class="
		w-full
		bg-indigo-black
		text-indigo-lightest text-center font-bold"
	>
		<div class="
			container mx-auto h-16
			flex flex-row items-center justify-around
			text-sm"
		>
			{props.children}
		</div>
	</nav>
)

Header.Nav.Link = props => (
	<Link
		activeClassName="bg-indigo-darker text-white"
		class="
			flex-1
			mx-2 max-w-xs p-2 h-8
			text-indigo-lightest hover:text-white no-underline rounded-full
			hover:bg-indigo-dark"
		{...props}
	/>
);

export default Header;
