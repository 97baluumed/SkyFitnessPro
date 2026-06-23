// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./app/Main/Main";
import Profile from "./components/Profile/Profile";
import CoursePage from "./components/CoursePage/CoursePage";
import TrainingPage from "./components/TrainingPage/TrainingPage";
import Header from "./components/Header/Header";
import { useState } from "react";
import AuthModal from "./components/Modal/AuthModal/AuthModal";
import AuthGuard from "./components/AuthGuard/AuthGuard";

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
					<Route path="/login" element={<AuthModal closeModal={closeModal} />} />

					<Route
						path="/profile"
						element={
							<AuthGuard>
								<Profile />
							</AuthGuard>
						}
					/>
					<Route
						path="/training/:courseId/:trainingId"
						element={
							<AuthGuard>
								<TrainingPage />
							</AuthGuard>
						}
					/>
					<Route path="/course/:id" element={<CoursePage openModal={openModal} />} />

					<Route path="*" element={<div>404 Not Found</div>} />

					<Route path="/profile" element={<Profile />} />
					<Route path="/training/:courseId/:trainingId" element={<TrainingPage />} />
				</Routes>
				{isModalOpen && <AuthModal closeModal={closeModal} />}
			</div>
		</Router>
	);
}

export default App;