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
				<div class="container mx-auto"><h1 class="text-5xl max-w-sm">Easy Appeal System - InfoEducație 2020</h1></div>
			</header>
			<div class="hero-button absolute text-center">
				<Link class="px-6 py-3 bg-indigo-dark hover:bg-indigo active:bg-indigo-darker shadow-md tems-center text-indigo-lightest font-bold no-underline leading-none rounded-full inline-flex" href="/tasks">
					Intră în cont
					<svg class="fill-current opacity-75 h-4 w-4 ml-2 -mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
				</Link>
			</div>
		</div>
		<div class="container mx-auto">
			<p class="p-4 md:px-8">
				Olimpiada de Informatică, faza pe județ, mereu a fost o fază care la București stârnește o oarecare dezordine an de an. Datorită unui regulament vechi și outdated în raport cu tehnologia modernă, procese precum văzutul baremelor și a rezultatului evaluării necesită depunere de contestație și birocrație multă, iar mulți aleg să sară peste asta și să nu știe niciodată de ce au luat punctajul pe care l-au luat. De asemenea, odată cu noua legislație privind majoritatea Olimpiadelor școlare, sectoarele din București au fost clasificate ca și județe iar faza pe sector a fost eliminată, ceea ce a dus la un influx mare de participanți. Toate centrele de examen au fost puse pe post de centre de contestații ca să facă față, obligând astfel deschiderea școlilor de dimineață pentru examen, și închiderea lor de-abia seara după contestații.
			</p>
			<p class="p-4 md:px-8">
				EAS - Easy Appeal System - caută să rezolve aceste probleme. Utilizând coduri unice fiecărui concurent, EAS oferă o soluție modernă și securizată și pune la dispoziția fiecărui elev o platformă ușor de folosit unde poate să își vadă rezultatul și raportul evaluării automate, și unde poate opțional să inițieze procesul de depunere a contestațiilor.
			</p>
			<p class="p-4 md:px-8">
				Fiecare concurent primește la început de probă o fișă pe care este notat ID-ul său, un cod de acces, și linkul de la instanța publică de EAS. De acolo, un concurent poate vedea statusul evaluării, rezultatul evaluării, sursa proprie, și va putea depune conestație pentru una sau mai multe probleme direct din interfață.
			</p>
		</div>
	</article>
);

export default Home;
