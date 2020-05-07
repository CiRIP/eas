import { h } from 'preact';
import { Link } from 'preact-router/match';

const TaskList = props => (
	<ul class="container mx-auto list-reset px-4">
		{props.children}
	</ul>
);

TaskList.Item = props => (
	<li>
		<Link class="flex items-center h-24 px-4 border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black" href={'/tasks/' + props.id}>
			<span class="flex-1">
				<strong>{props.name}</strong>
				{props.appealed ?
					<span class="p-2 mx-4 h-6 bg-indigo-lightest items-center text-indigo-light leading-none rounded-full inline-flex" role="alert">
						<span class="text-left text-xs flex-auto italic">Contestație depusă</span>
					</span>
				: null }
			</span>
			<div><span class="text-2xl font-bold">{props.score}</span><span class="text-sm opacity-25 ml-1">/100</span></div>
			<svg class="fill-current opacity-25 ml-8" height="24" width="13">
				<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
			</svg>
		</Link>
	</li>
);

export default TaskList;
