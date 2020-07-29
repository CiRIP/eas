/* eslint-disable react/display-name */
import { h } from 'preact';
import { Link } from 'preact-router/match';

const AppealList = props => (
	<ul class="container mx-auto list-reset px-4">
		{props.children}
	</ul>
);

const appealStatuses = {
	PENDING: (
		<span class="p-2 mx-4 h-6 bg-yellow-lightest items-center text-yellow-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">În așteptare</span>
		</span>
	),
	PROCESSING: (
		<span class="p-2 mx-4 h-6 bg-orange-lightest items-center text-orange-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">În procesare</span>
		</span>
	),
	FINALIZED: (
		<span class="p-2 mx-4 h-6 bg-green-lightest items-center text-green-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">Soluționată</span>
		</span>
	),
	REJECTED: (
		<span class="p-2 mx-4 h-6 bg-red-lightest items-center text-red-dark leading-none rounded-full inline-flex" role="alert">
			<span class="text-left text-xs flex-auto italic">Respinsă</span>
		</span>
	)
};

AppealList.Item = props => (
	<li>
		<Link class="flex items-center h-24 px-4 border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black" href={'/appeals/' + props.id}>
			<span class="flex-1">
				<div><strong>{props.name}</strong></div>
				<div class="text-sm opacity-25 mt-1">{props.reason}</div>
			</span>

			{appealStatuses[props.status]}
			<svg class="fill-current opacity-25 ml-8" height="24" width="13">
				<polyline fill="none" stroke="black" points="0,0 12,12 0,24" />
			</svg>
		</Link>
	</li>
);

export default AppealList;
