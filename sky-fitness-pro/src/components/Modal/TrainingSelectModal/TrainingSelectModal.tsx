// src/components/Modal/TrainingSelectModal/TrainingSelectModal.tsx

import React, { useEffect, useState } from "react";
import "./TrainingSelectModal.css";
import TrainingLink from "./TrainingLink/TrainingLink";
import { getWorkoutsByCourse } from "../../../utils/api";
import { Workout } from "../../../types/training";
import { useUser } from "../../../contexts/user";

interface ModalProps {
	closeModal: () => void;
	courseId: string;
}

const TrainingSelectModal: React.FC<ModalProps> = ({ closeModal, courseId }) => {
	const [workoutInfo, setWorkoutInfo] = useState<Workout[]>([]); // ✅ Workout, а не Exercise
	const [isLoaded, setIsLoaded] = useState(false);
	const { user } = useUser();

	useEffect(() => {
		const fetchWorkoutInfo = async () => {
			if (!courseId) {
				console.warn("⚠️ courseId не передан");
				setIsLoaded(true);
				return;
			}
			if (!user || !user?.token?.trim()) {
				if (!user) {
					console.warn("⚠️ user не загружен");
				} else {
					console.error("❌ user.token отсутствует или пустой:", user?.token);
				}
				setIsLoaded(true);
				return;
			}

			try {
				const workouts = await getWorkoutsByCourse(courseId, user.token);
				if (Array.isArray(workouts)) {
					setWorkoutInfo(workouts as Workout[]);
				} else if (workouts?._id) {
					// Если API вернул один объект, обернём в массив
					setWorkoutInfo([workouts as Workout]);
				} else {
					setWorkoutInfo([]);
				}
			} catch (error) {
				console.error("❌ Ошибка:", error);
			} finally {
				setIsLoaded(true);
			}
		};

		fetchWorkoutInfo();
	}, [courseId, user]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm" onClick={closeModal}>
			{isLoaded ? (
				<div
					className="relative w-full max-w-md mx-4 p-8 bg-white rounded-[30px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden animate-fade-in-up"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						onClick={closeModal}
						className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Закрыть окно"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
						Выберите тренировку
					</h2>

					<div className="flex flex-col gap-3 max-h-[374px] overflow-y-auto pr-2 custom-scrollbar">
						{workoutInfo.map((workout, index) => (
							<TrainingLink
								key={index}
								trainingId={workout._id}
								name={workout.name}
								courseId={courseId}
								exercises={workout.exercises || []} // ✅ Теперь exercises доступен!
							/>
						))}
						{workoutInfo.length === 0 && (
							<p className="text-center text-gray-500 py-4">Тренировок пока нет</p>
						)}
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center h-64">
					<p className="text-lg text-gray-700 animate-pulse">Загрузка...</p>
				</div>
			)}
		</div>
	);
};

export default TrainingSelectModal;