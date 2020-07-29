import { h } from "preact";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../loading";

const querySubmissionInfo = gql`
query Submission($id: UUID!) {
	submission(id: $id) {
		testResultsList {
			status
			score
			testCase {
				name
				value
			}
		}
	}
}
`;

const testCaseStatuses = {
	OK: 'OK',
	INCORRECT: 'Răspuns incorect',
	TIME_LIMIT_EXCEEDED: 'Limită de timp depășită',
	MEMORY_LIMIT_EXCEEDED: 'Limită de memorie depășită',
	COMPILE_ERROR: 'Eroare de compilare',
	RUNTIME_ERROR: 'Eroare de runtime'
};

const SubmissionInfo = props => (
	<Query query={querySubmissionInfo} variables={{ id: props.id }}>
		{({ loading, error, data }) => {
			if (loading) return <Loading dark />;

			return (
				<div class="container mx-auto px-4">
					<table class="w-full my-4 text-left">
						<thead class="uppercase text-indigo-light text-xs">
							<tr>
								<th class="p-4 pr-4">Nume test</th>
								<th class="w-16 p-4">Rezultatul evaluării</th>
								<th class="w-16 p-4">Punctajul obținut</th>
							</tr>
						</thead>
						<tbody>
							{data.submission.testResultsList.map(e => (
								<tr class="border-b border-indigo-lightest hover:bg-grey-lightest no-underline text-black">
									<td class="p-4"><code>{e.testCase.name}</code></td>
									<td class="p-4">{testCaseStatuses[e.status]}</td>
									<td class="p-4">{e.score}<span class="text-sm opacity-25">/{e.testCase.value}</span></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		}}
	</Query>
)

export default SubmissionInfo;