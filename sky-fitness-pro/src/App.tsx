import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./app/Main/Main";
import Profile from "./components/Profile/Profile";
import CoursePage from "./components/CoursePage/CoursePage";
import TrainingPage from "./components/TrainingPage/TrainingPage";
import Header from "./components/Header/Header";
import { useState } from "react";
import AuthModal from "./components/Modal/AuthModal/AuthModal";

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<Router>
			<div>
				<Header openModal={openModal} />
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/course/:id" element={<CoursePage openModal={openModal} />} />
					<Route path="/training/:courseId/:id" element={<TrainingPage />} />
				</Routes>
				{isModalOpen && <AuthModal closeModal={closeModal} />}
			</div>
		</Router>
	);
}

export default App;
