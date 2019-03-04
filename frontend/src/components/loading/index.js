import { h } from 'preact';

const Loading = props => {
	let color = "#ffffff";
	let size = "128px";
	if (props.dark) color = "#606f7b";
	if (props.small) size = "32px";
	return (
		<svg
			width={size}
			height={size}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
			class="m-8 block mx-auto"
			style="background-image: none; background-position: initial initial; background-repeat: initial initial;"
		>
			<circle
				cx="50"
				cy="50"
				r="0"
				fill="none"
				ng-attr-stroke="{{config.c1}}"
				ng-attr-stroke-width="{{config.width}}"
				stroke={color}
				stroke-width="2"
			>
				<animate
					attributeName="r"
					calcMode="spline"
					values="0;20"
					keyTimes="0;1"
					dur="1"
					keySplines="0 0.2 0.8 1"
					begin="-0.35s"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="opacity"
					calcMode="spline"
					values="1;0"
					keyTimes="0;1"
					dur="1"
					keySplines="0.2 0 0.8 1"
					begin="-0.35s"
					repeatCount="indefinite"
				/>
			</circle>
			<circle
				cx="50"
				cy="50"
				r="0"
				fill="none"
				ng-attr-stroke="{{config.c2}}"
				ng-attr-stroke-width="{{config.width}}"
				stroke="#b2b7ff"
				stroke-width="2"
			>
				<animate
					attributeName="r"
					calcMode="spline"
					values="0;50"
					keyTimes="0;1"
					dur="1"
					keySplines="0 0.2 0.8 1"
					begin="0s"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="opacity"
					calcMode="spline"
					values="1;0"
					keyTimes="0;1"
					dur="1"
					keySplines="0.2 0 0.8 1"
					begin="0s"
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	)
}

export default Loading;