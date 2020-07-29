import { h } from 'preact';
import { Link } from 'preact-router/match';

import Header from '../../components/header';
import AppealList from '../../components/appeal-list';
import Loading from '../../components/loading';
import BrokenDocument from '../../components/broken-document';

import { Query } from "react-apollo";
import gql from "graphql-tag";

const queryUserInfo = gql`
{
	currentUser {
		firstName
		lastName
		participationId
	}
}
`;

const queryAppealList = gql`
{
	currentUser {
		appealsList {
			id
			status
			submission {
				task {
					name
				}
				totalScore
			}
			reason {
				title
			}
		}
	}
}
`;

const Appeals = () => (
	<div>
		<header>
			<Query query={queryUserInfo}>
				{({ loading, error, data }) => {
					if (loading) return <Header.Main parent="/appeals"><Loading /></Header.Main>;
					if (error) return <Header.Main title="Eroare la obținerea datelor." subtitle={error.message} parent="/appeals" />;

					return <Header.Main title={data.currentUser.firstName + ' ' + data.currentUser.lastName} subtitle={data.currentUser.participationId} parent="/appeals" />;
				}}
			</Query>
			<Header.Nav>
				<Header.Nav.Link href="/tasks">Probleme</Header.Nav.Link>
				<Header.Nav.Link href="/appeals">Contestații</Header.Nav.Link>
			</Header.Nav>
		</header>

		<Query query={queryAppealList}>
			{({ loading, error, data }) => {
				if (loading) return <Loading dark />;

				if (!data.currentUser.appealsList || !data.currentUser.appealsList.length) return (
					<div class="container flex flex-col items-center mx-auto list-reset px-4 py-16">
						<BrokenDocument />
						<h3>Nu există rezultate</h3>
						<p class="my-2">Nu ai depus nicio contestație încă. </p>
						<Link class="py-2 px-4 m-4 h-8 bg-indigo-lightest items-center text-indigo-light leading-none no-underline rounded-full inline-flex" href="/appeals/new" role="alert">
							<span class="uppercase text-indigo-light font-bold text-xs">Depune o contestație</span>
							<svg class="fill-current opacity-75 h-4 w-4 ml-2 -mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
						</Link>
					</div>
				);
				
				return (
					<AppealList>
						<Link href="/appeals/new" class="flex items-center h-16 px-8 border-b border-dotted border-indigo-lightest hover:bg-grey-lightest no-underline text-indigo-darkest">
							<svg width="16" height="16" fill-rule="evenodd" clip-rule="evenodd" class="mr-4 fill-current">
								<path d="M7 7v-7h1v7h7v1h-7v7h-1v-7h-7v-1h7z" />
							</svg>
							<span>Depune contestație</span>
						</Link>
						{data.currentUser.appealsList.map(e => <AppealList.Item name={e.submission.task.name} id={e.id} score={e.submission.totalScore} reason={e.reason.title} status={e.status} />)}
					</AppealList>
				);
			}}
		</Query>
	</div>
);

export default Appeals;
