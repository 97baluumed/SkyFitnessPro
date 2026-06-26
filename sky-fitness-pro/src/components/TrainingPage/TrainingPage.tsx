import ExerciseProgress from "./ExerciseProgress/ExerciseProgress";
import TrainingProgressModal from "../Modal/TrainingProgressModal/TrainingProgress/TrainingProgressModal";
import SaveTrainingProgressModal from "../Modal/TrainingProgressModal/SaveTrainingProgressModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	getProgress,
	saveWorkoutProgress,
	getWorkoutsByCourse,
} from "../../utils/api";
import { useUser } from "../../hooks/useUser";
import { Exercise } from "../../types/training";

function TrainingPage() {
	const { courseId, trainingId } = useParams<{ courseId: string; trainingId: string }>();
	const [isTrainingProgressModalOpen, setIsTrainingProgressModalOpen] = useState(false);
	const [isSaveTrainingProgressModalOpen, setIsSaveTrainingProgressModalOpen] = useState(false);
	const [workout, setWorkout] = useState<Exercise | null>(null);
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [exerciseProgress, setExerciseProgress] = useState<{ [key: string]: number }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [withoutExercise, setWithoutExercise] = useState(false);
	const { user } = useUser();

	const openTrainingProgressModal = () => {
		setIsTrainingProgressModalOpen(true);
		setIsSaveTrainingProgressModalOpen(false);
	};

	const closeTrainingProgressModal = () => setIsTrainingProgressModalOpen(false);

	const handleSaveTrainingProgress = (updatedQuantities: { [exerciseName: string]: number }) => {

		if (!user?.token || !courseId || !workout) {
			console.error("Отсутствуют данные (token, courseId или workout)");
			return;
		}

		const progressData = exercises.map(ex => updatedQuantities[ex.name] ?? 0);

		saveWorkoutProgress(user.token, courseId, workout._id, progressData)
			.then(() => {
				localStorage.setItem("sky_fitness_progress_updated", Date.now().toString());

				getProgress(user.token, courseId, workout._id)
					.then((data) => {
						if (Array.isArray(data?.progressData)) {
							const newProgress: { [key: string]: number } = {};
							data.progressData.forEach((val: number, idx: number) => {
								if (exercises[idx]) {
									newProgress[exercises[idx].name] = val;
								}
							});
							setExerciseProgress(newProgress);
						} else if (typeof data?.progress === "number") {
							const allProgress: number = data.progress;
							const newProgress: { [key: string]: number } = {};
							exercises.forEach(ex => {
								newProgress[ex.name] = allProgress;
							});
							setExerciseProgress(newProgress);
						}

						setIsTrainingProgressModalOpen(false);
						setIsSaveTrainingProgressModalOpen(true);
					})
					.catch((error) => {
						console.error("Ошибка получения прогресса после сохранения:", error);
						setIsTrainingProgressModalOpen(false);
						setIsSaveTrainingProgressModalOpen(true);
					});
			})
			.catch((error) => {
				console.error("Ошибка сохранения прогресса:", error);
				alert(`Ошибка сохранения: ${error.message}`);
			});
	};

	useEffect(() => {
		if (courseId && trainingId && user?.token) {
			getWorkoutsByCourse(courseId, user.token)
				.then((data) => {
					if (Array.isArray(data)) {
						const found = data.find(w => w._id === trainingId);
						if (found) {
							setWorkout(found);
							setExercises(found.exercises || []);
						} else {
							throw new Error(`Тренировка с ID ${trainingId} не найдена в курсе ${courseId}`);
						}
					} else if (typeof data === "object" && data?._id === trainingId) {
						setWorkout(data);
						setExercises(data.exercises || []);
					} else {
						throw new Error("Некорректный ответ от API: expected array or object with matching _id");
					}
				})
				.catch((error: unknown) => {
					console.error("Ошибка загрузки тренировки:", error);
					setWorkout(null);
					setExercises([]);
				})
				.finally(() => setIsLoading(false));
		}
	}, [courseId, trainingId, user?.token]);

	useEffect(() => {
		if (user?.token && courseId && workout && exercises.length > 0) {
			getProgress(user.token, courseId, workout._id)
				.then((data) => {
					const newProgress: { [key: string]: number } = {};

					if (Array.isArray(data?.progressData)) {
						data.progressData.forEach((val: number, idx: number) => {
							if (exercises[idx]) {
								newProgress[exercises[idx].name] = val;
							}
						});
					} else if (typeof data?.progress === "number") {
						exercises.forEach(ex => {
							newProgress[ex.name] = data.progress;
						});
					}

					setExerciseProgress(newProgress);
				})
				.catch((error) => console.error("Ошибка прогресса:", error));
		}
	}, [user?.token, courseId, workout, exercises]);

	const handleAddRealQuantityWithoutExercises = () => {
		if (user?.token && courseId && workout) {
			saveWorkoutProgress(user.token, courseId, workout._id, [0])
				.then(() => {
					getProgress(user.token, courseId, workout._id)
						.then((data) => {
							if (typeof data?.progress === "number") {
								setWithoutExercise(true);
							}
						})
						.catch((error: unknown) => console.error("Ошибка прогресса:", error));
				})
				.catch((error: unknown) => console.error("Ошибка сохранения:", error));
		}
	};

	return (
		<>
			{isLoading ? (
				<p>Загрузка курса...</p>
			) : (
				<div className="flex flex-col mt-[40px] sm:mt-[60px] gap-[24px] sm:gap-[40px]">
					<div className="flex flex-col gap-[10px] sm:gap-[24px]">
						<h2 className="text-[24px] sm:text-[40px] lg:text-[60px] font-medium text-left leading-none">
							{workout?.name}
						</h2>
						<p className="text-[18px] sm:text-[22px] lg:text-[32px] text-left leading-none underline decoration-solid">
							{workout?.name}
						</p>
					</div>

					<div className="flex justify-center bg-[#FFFFFF] rounded-[28px]">
						<iframe
							className="w-[343px] h-[189px] sm:w-full sm:h-[400px] md:h-[639px] rounded-[30px]"
							src={workout?.video}
						></iframe>
					</div>

					<div className="flex flex-col gap-[20px] sm:gap-[40px] bg-[#FFFFFF] rounded-[28px] p-[30px] sm:p-[40px]">
						{exercises && workout ? (
							<>
								<h3 className="text-[32px] text-center md:text-start leading-9">Упражнения тренировки</h3>
								<div className="flex flex-row justify-center md:justify-start flex-wrap gap-x-[60px] gap-y-[30px]">
									{exercises.map((exercise, index) => (
										<ExerciseProgress key={index} exercise={exercise} progress={exerciseProgress[exercise.name] || 0} />
									))}
								</div>
								<button
									onClick={openTrainingProgressModal}
									className="flex sm:w-[320px] text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
								>
									Заполнить свой прогресс
								</button>
								{isTrainingProgressModalOpen && !isSaveTrainingProgressModalOpen && (
									<TrainingProgressModal
										closeModal={closeTrainingProgressModal}
										onSubmit={handleSaveTrainingProgress}
										exercises={exercises}
										exerciseProgress={exerciseProgress}
									/>
								)}
								{isTrainingProgressModalOpen && isSaveTrainingProgressModalOpen && (
									<SaveTrainingProgressModal closeModal={closeTrainingProgressModal} />
								)}
							</>
						) : (
							<>
								{withoutExercise ? (
									<button
										className="flex sm:w-[320px] text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 h-[52px] bg-[#F7F7F7] rounded-[46px]"
										disabled
									>
										Тренировка завершена
									</button>
								) : (
									<button
										onClick={handleAddRealQuantityWithoutExercises}
										className="flex sm:w-[320px] text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
									>
										Завершить тренировку
									</button>
								)}
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default TrainingPage;