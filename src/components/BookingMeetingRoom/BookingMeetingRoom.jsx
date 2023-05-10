import {useEffect, useState} from "react";

import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {ru} from "date-fns/locale";

import css from './BookingMeetingRoom.module.css';
import rooms from '../../api/fetchRooms.json';

const customStyles = {
	control: (base, state) => ({
		...base,
		fontSize: '16px',
		borderColor: state.isFocused ? "black" : "#b7b4b4",
		boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
		"&:hover": {
			borderColor: "black"
		}
	})
};

function BookingMeetingRoom() {
	//options
	const [towers, setTowers] = useState([]);
	const [floors, setFloors] = useState([]);
	const [roomsNumber, setRoomsNumber] = useState([]);

	//selected value
	const [selectedTower, setSelectedTower] = useState('');
	const [selectedFloor, setSelectedFloor] = useState('');
	const [selectedRoom, setSelectedRoom] = useState('');
	const [startDate, setStartDate] = useState(false);
	const [endDate, setEndDate] = useState(false);
	const [comment, setComment] = useState('');

	//error validation
	const [towerInvalid, setTowerInvalid] = useState(false);
	const [floorInvalid, setFloorInvalid] = useState(false);
	const [roomInvalid, setRoomInvalid] = useState(false);
	const [startDateInvalid, setStartDateInvalid] = useState(false);
	const [endDateInvalid, setEndDateInvalid] = useState(false);

	function resetErrors() {
		setTowerInvalid(false);
		setFloorInvalid(false);
		setRoomInvalid(false);
		setStartDateInvalid(false);
		setEndDateInvalid(false);
	}

	//set options towers select
	useEffect(() => {
		setTowers(Array.from(new Set(rooms.map(room => room.tower))));
	}, [])

	//reset form
	function handleReset() {
		setSelectedTower('');
		setSelectedFloor('');
		setSelectedRoom('');
		setStartDate(false);
		setEndDate(false);
		setComment('');
		setFloors([]);
		setRoomsNumber([]);

		resetErrors();

		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};


	//submit
	function handleSubmit(e) {
		e.preventDefault();

		resetErrors();

		let isValid = true;
		if (!selectedTower) {
			setTowerInvalid(true);
			isValid = false;
		}
		if (!selectedFloor) {
			setFloorInvalid(true);
			isValid = false;
		}
		if (!selectedRoom) {
			setRoomInvalid(true);
			isValid = false;
		}
		if (!startDate) {
			setStartDateInvalid(true);
			isValid = false;
		}
		if (!endDate) {
			setEndDateInvalid(true);
			isValid = false;
		}
		if ((endDate && startDate) && (endDate < startDate)) {
			isValid = false;
			setEndDateInvalid(true);
			setStartDateInvalid(true);
		}

		if (isValid) {
			const formData = {
				tower: selectedTower.value,
				floor: selectedFloor.value,
				roomNumber: selectedRoom.value,
				startTime: startDate,
				endTime: endDate,
				comment: comment,
			};

			console.log(JSON.stringify(formData, null, 2));
		}
	}

	//on choosing a tower
	function changeTower(option) {
		setSelectedTower(option);
		setSelectedFloor('');
		setSelectedRoom('');

		const towerRooms = rooms.filter((room) => room.tower === option.value);
		const uniqueFloors = Array.from(new Set(towerRooms.map((room) => room.floor))).sort((a, b) => a - b);
		setFloors(uniqueFloors);
		setTowerInvalid(false);
	}

	//on choosing a floor
	function changeFloor(option) {
		setSelectedFloor(option);

		const towerRooms = rooms.filter((room) => (room.tower === selectedTower.value && room.floor.toString() === option.value.toString()));
		const uniqueRoomNumber = Array.from(new Set(towerRooms.map((room) => room.roomNumber))).sort((a, b) => a - b);
		setRoomsNumber(uniqueRoomNumber);
		setSelectedRoom('');
		setFloorInvalid(false);
	}

	return (
		<form className={css.booking_form} onSubmit={handleSubmit}>
			<h2>Бронирование переговорной</h2>
			<div className={css.form_row}>

				<div className={css.form_module}>
					<label>Башня* :</label>
					<Select
						id="tower"
						value={selectedTower}
						onChange={changeTower}
						options={towers.map((item, index) => ({
							value: item,
							label: item
						}))}
						styles={customStyles}
						placeholder="Выберите башню"
					>
					</Select>
					{towerInvalid && <p className={css.error}>Выберите башню</p>}
				</div>


				<div className={css.form_module}>
					<label>Этаж* :</label>
					<Select
						id="floor"
						value={selectedFloor}
						onChange={changeFloor}
						options={floors.map((item, index) => ({
							value: item,
							label: item
						}))}
						styles={customStyles}
						placeholder="Выберите этаж"
					>
					</Select>
					{floorInvalid && <p className={css.error}>Выберите этаж</p>}
				</div>
			</div>
			<div className={css.form_module}>
				<label>Переговорка* :</label>
				<Select
					id="room"
					value={selectedRoom}
					onChange={(option) => {
						setSelectedRoom(option);
						setRoomInvalid(false);
					}}
					options={roomsNumber.map((item) => ({
						value: item,
						label: item
					}))}
					styles={customStyles}
					placeholder="Выберите комнату"
				>
				</Select>
				{roomInvalid && <p className={css.error}>Выберите комнату</p>}
			</div>

			<div className={css.form_row}>
				<div className={css.form_module}>
					<label>Начало* :</label>
					<DatePicker
						className={css.date_picker}
						selected={startDate}
						onChange={(date) => {
							setStartDate(date);
							setStartDateInvalid(false);
						}}
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={5}
						timeCaption="Время"
						dateFormat="d MMMM yyyy HH:mm"
						locale={ru}
						onChangeRaw={(e) => {
							e.preventDefault();
						}}
					/>
					{startDateInvalid && <p className={css.error}>Выберите дату старта</p>}
				</div>

				<div className={css.form_module}>
					<label>Окончание* :</label>
					<DatePicker
						className={css.date_picker}
						selected={endDate}
						onChange={(date) => {
							setEndDate(date);
							setEndDateInvalid(false);
						}}
						showTimeSelect
						timeFormat="HH:mm"
						timeIntervals={5}
						timeCaption="Время"
						dateFormat="d MMMM yyyy HH:mm"
						locale={ru}
						onChangeRaw={(e) => {
							e.preventDefault();
						}}
					/>
					{endDateInvalid && <p className={css.error}>Выберите дату окончания</p>}
				</div>

			</div>
			<div className={css.form_module}>
				<label>Комментарий:</label>
				<textarea
					className={css.textarea_form}
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				></textarea>
			</div>

			<div className={css.form_module_button}>
				<button className={css.submit} type="submit">Отправить</button>
				<button className={css.reset} type="button" onClick={handleReset}>Очистить
				</button>
			</div>

		</form>
	);
}

export default BookingMeetingRoom;