// src/components/Card/UserCards/UserCards.tsx

import { useState, useEffect } from "react";
import TrainingSelectModal from "../../Modal/TrainingSelectModal/TrainingSelectModal";
import { CardType } from "../../../types/cards";
import {
	deleteCourseToUser,
	getProgress,
	getWorkoutsByCourse,
	resetProgress,
} from "../../../utils/api";
import { useUser } from "../../../contexts/user";

type UserCardsProps = CardType & { onDelete: (courseId: string) => void };

function UserCards({ courseId, nameRu, onDelete }: UserCardsProps) {
	const [isTrainingSelectModalOpen, setTrainingSelectModalOpen] = useState(false);
	const [workoutInfo, setWorkoutInfo] = useState<{ _id: string; nameRU: string; description: string }[]>([]);
	const [progressData, setProgressData] = useState<number[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useUser();
	const FULL_PROGRESS = 100;

	const getImageByCourseId = (id: string): string => {
		switch (id) {
			case "ab1c3f": return "/yoga.jpg";
			case "kfpq8e": return "/stretching.jpg";
			case "ypox9r": return "/fitness.jpg";
			case "6i67sm": return "/stepaerobics.jpg";
			case "q02a6i": return "/bodyFlex.jpg";
			default: return "/zagl.jpg";
		}
	};

	const openTrainingSelectModal = () => setTrainingSelectModalOpen(true);
	const closeTrainingSelectModal = () => setTrainingSelectModalOpen(false);

	useEffect(() => {
		if (!user?.uid || !user?.token) return;

		const fetchWorkouts = async () => {
			try {
				const workouts = await getWorkoutsByCourse(courseId, user.token);
				setWorkoutInfo(Array.isArray(workouts) ? workouts : []);
			} catch (error) {
				console.error("❌ Ошибка при получении тренировок:", error);
			}
		};
		fetchWorkouts();
	}, [courseId, user?.uid, user?.token]);

	// ✅ ИСПРАВЛЕНО: Получаем прогресс по тренировкам — считаем avgProgress
	useEffect(() => {
		if (workoutInfo.length > 0 && user?.token) {
			const fetchProgress = async () => {
				try {
					const allProgresses = await Promise.all(
						workoutInfo.map(async (workout) => {
							try {
								const progress = await getProgress(user.token, courseId, workout._id);
								return progress?.progressData || [];
							} catch {
								return [];
							}
						})
					);

					const flatProgresses = allProgresses.flat();

					// ✅ Исправлено: явные типы и убраны лишние переменные
					const avgProgress = flatProgresses.length > 0
						? flatProgresses.reduce((sum: number, val: number) => sum + val, 0) / flatProgresses.length
						: 0;

					const progressPercent = Math.round(avgProgress);

					setProgressData([progressPercent]);
					setIsLoading(true);
				} catch (error) {
					console.error("❌ Ошибка при получении прогресса:", error);
					setIsLoading(true);
				}
			};
			fetchProgress();
		} else {
			setIsLoading(true);
		}
	}, [workoutInfo, user?.token, courseId]);

	const visitedRatio = progressData.length > 0 ? progressData[0] : 0;

	// ✅ Убраны неиспользуемые переменные: totalCompleted, totalWorkoutCount, completedWorkouts

	async function deleteCourse() {
		if (!user?.uid || !user?.token) return;

		try {
			await deleteCourseToUser(user.token, courseId);
			onDelete(courseId);
		} catch (error) {
			if (error instanceof Error && (error as Error).message.includes("не был добавлен")) {
				console.warn(`ℹ️ Курс ${courseId} уже удалён или не был добавлен`);
			} else {
				console.error("❌ Ошибка при удалении курса:", error);
			}
		}
	}

	function restartCourse() {
		if (!user?.uid || !user?.token) return;

		resetProgress(user.token, courseId)
			.then(() => {
				setProgressData([]);
			})
			.catch((error) => {
				console.error("❌ Ошибка при сбросе прогресса:", error);
			});
	}

	return (
		<>
			{isLoading ? (
				<div
					key={courseId}
					className="card w-[343px] sm:w-[360px] bg-white rounded-[30px] flex flex-col gap-6 shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)]"
				>
					<img className="" src={getImageByCourseId(courseId)} alt={nameRu} />
					<div className="cardImage relative">
						<button
							onClick={deleteCourse}
							className="addCourse w-[32px] h-[32px] absolute top-[-330px] right-5"
							title="Удалить курс"
						>
							<svg className="w-[32px] h-[32px]">
								<use xlinkHref="./icon/sprite.svg#icon-minus" />
							</svg>
						</button>
					</div>
					<div className="flex flex-col gap-5 mx-[21px] sm:mx-[30px]">
						<div className="courseTitle">
							<h3 className="text-[32px] font-medium text-left">{nameRu}</h3>
						</div>
						<div className="courseParams flex flex-row flex-wrap gap-1.5 mb-[15px]">
							<p className="parameter bg-[#F7F7F7] p-2.5 rounded-full flex flex-row gap-1.5 items-center">
								<svg className="w-[15px] h-[15px]">
									<use xlinkHref="./icon/sprite.svg#icon-calendar" />
								</svg>
								25 дней
							</p>
							<p className="parameter bg-[#F7F7F7] p-2.5 rounded-full flex flex-row gap-1.5 items-center">
								<svg className="w-[15px] h-[15px]">
									<use xlinkHref="./icon/sprite.svg#icon-time" />
								</svg>
								20-50 мин/день
							</p>
							<p className="parameter bg-[#F7F7F7] p-2.5 rounded-full flex flex-row gap-1.5 items-center">
								<svg className="w-[18px] h-[18px]">
									<use xlinkHref="./icon/sprite.svg#icon-complexity" />
								</svg>
								Сложность
							</p>
							<div className="w-full h-[36px] flex flex-col justify-center gap-[10px] opacity-100 mt-[20px]">
								<div className="text-lg text-start">Прогресс {Math.round(visitedRatio)}%</div>
								<div className="relative w-full h-[6px] bg-gray-300 rounded-full">
									<div
										className="absolute top-0 left-0 h-[6px] bg-[#00C1FF]"
										style={{ width: `${Math.round(visitedRatio)}%` }}
									></div>
								</div>
							</div>
							<div className="items-center mt-[40px]">
								{Math.round(visitedRatio) !== FULL_PROGRESS ? (
									<button
										onClick={openTrainingSelectModal}
										className="w-[300px] h-[52px] bg-[#BCEC30] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] text-lg"
									>
										{Math.round(visitedRatio) === 0 ? "Начать тренировки" : "Продолжить"}
									</button>
								) : (
									<button
										onClick={restartCourse}
										className="w-[300px] h-[52px] bg-[#BCEC30] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] text-lg"
									>
										Начать заново
									</button>
								)}
								{isTrainingSelectModalOpen && (
									<TrainingSelectModal courseId={courseId} closeModal={closeTrainingSelectModal} />
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				<p>Загрузка...</p>
			)}
		</>
	);
}

export default UserCards;