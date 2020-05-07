import { h } from "preact";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import pascal from 'react-syntax-highlighter/dist/esm/languages/prism/pascal';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "../loading";

const querySubmissionSource = gql`
query Submission($id: UUID!) {
	submission(id: $id) {
		sourceName
		body
	}
}
`;


SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('pascal', pascal);



const SubmissionSource = props => (
	<div class="container mx-auto p-4">
		<Query query={querySubmissionSource} variables={{ id: props.id }}>
			{({ loading, error, data }) => {
				if (loading) return <Loading dark />;

				return <SyntaxHighlighter language="cpp" style={vs}>{data.submission.body}</SyntaxHighlighter>
			}}
		</Query>
	</div>
);

export default SubmissionSource;