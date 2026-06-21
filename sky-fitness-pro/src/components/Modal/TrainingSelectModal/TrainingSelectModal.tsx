// src/components/Modal/TrainingSelectModal/TrainingSelectModal.tsx

import React, { useEffect, useState } from "react";
import "./TrainingSelectModal.css";
import TrainingLink from "./TrainingLink/TrainingLink";
import { getWorkoutsByCourse } from "../../../utils/api";
import { Exercise } from "../../../types/training";
import { useUser } from "../../../contexts/user"; // ✅ добавлен хук

interface ModalProps {
	closeModal: () => void;
	courseId: string;
}

const TrainingSelectModal: React.FC<ModalProps> = ({ closeModal, courseId }) => {
	const [workoutInfo, setWorkoutInfo] = useState<Exercise[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const { user } = useUser(); // ✅ получаем user

	useEffect(() => {
		const fetchWorkoutInfo = async () => {
			if (!courseId || !user?.token) {
				setIsLoaded(true);
				return;
			}

			try {
				// ✅ Получаем массив тренировок напрямую по courseId и token
				const workouts = await getWorkoutsByCourse(courseId, user.token);
				setWorkoutInfo(Array.isArray(workouts) ? workouts : []);
			} catch (error) {
				console.error("❌ Ошибка при получении информации о тренировках:", error);
			} finally {
				setIsLoaded(true);
			}
		};

		fetchWorkoutInfo();
	}, [courseId, user?.token]); // ✅ зависимости: courseId и user.token

	return (
		<div className="fixed z-40 inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			{isLoaded ? (
				<div
					className="relative flex flex-col items-center p-8 gap-8 w-[355px] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px] overflow-hidden"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-col items-start gap-3 w-full h-full">
						<h2 className="text-black text-[34px] text-start leading-10 font-medium mb-[20px]">Выберите тренировку</h2>

						<div className="flex flex-col gap-3 w-full h-[374px] overflow-y-auto leading-5 pr-[20px]">
							{workoutInfo.map((workout, index) => (
								<TrainingLink
									key={index}
									trainingId={workout._id}
									name={workout.name}
									courseId={courseId}
								/>
							))}
							{workoutInfo.length === 0 && (
								<p className="text-center text-gray-500 mt-4">Тренировок пока нет</p>
							)}
						</div>
					</div>
				</div>
			) : (
				<p className="text-black text">Загрузка...</p>
			)}
		</div>
	);
};

export default TrainingSelectModal;