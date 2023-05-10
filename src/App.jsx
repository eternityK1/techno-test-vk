import BookingMeetingRoom from "./components/BookingMeetingRoom/BookingMeetingRoom";
import css from './App.module.css';

function App() {
	return (
		<div className={css.container}>
			<div className={css.meeting_room_container}>
				<BookingMeetingRoom/>
			</div>
		</div>
	);
}

export default App;
