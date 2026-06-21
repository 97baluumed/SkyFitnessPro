// src/components/TrainingSelectModal/TrainingLink/TrainingLink.tsx

import { Link } from "react-router-dom";
import { getProgress } from "../../../../utils/api";
import { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/user";
import { Exercise } from "../../../../types/training";

interface TrainingLinkProps {
	trainingId: string;
	name: string;
	courseId: string;
	exercises: Exercise[]; // ✅ Теперь передаём упражнения
}

const TrainingLink: React.FC<TrainingLinkProps> = ({ trainingId, name, courseId, exercises }) => {
	const { user } = useUser();
	const [progressStatus, setProgressStatus] = useState<"not-started" | "started" | "completed">("not-started");

	useEffect(() => {
		if (!user?.token?.trim() || exercises.length === 0) return;

		getProgress(user.token, courseId, trainingId)
			.then((data) => {
				// Если нет прогресса
				if (!data || (!Array.isArray(data?.progressData) && typeof data?.progress !== "number")) {
					setProgressStatus("not-started");
					return;
				}

				// Прогресс как массив
				if (Array.isArray(data?.progressData)) {
					const progressData = data.progressData;
					// ✅ Добавлены типы: q: number, i: number
					const isFullyCompleted = progressData.every(
						(q: number, i: number) => q >= (exercises[i]?.quantity || 0)
					);
					const hasAnyProgress = progressData.some((q: number) => q > 0);

					if (isFullyCompleted) {
						setProgressStatus("completed");
					} else if (hasAnyProgress) {
						setProgressStatus("started");
					} else {
						setProgressStatus("not-started");
					}
				}
				// Прогресс как процент (0–100)
				else if (typeof data?.progress === "number") {
					const progressPercent = data.progress;
					if (progressPercent === 100) {
						setProgressStatus("completed");
					} else if (progressPercent > 0) {
						setProgressStatus("started");
					} else {
						setProgressStatus("not-started");
					}
				}
			})
			.catch(() => {
				setProgressStatus("not-started");
			});
	}, [user?.token, courseId, trainingId, exercises]);

	// ✅ Убираем дублирование: логика определяется по status
	const isCompleted = progressStatus === "completed";
	const isStarted = progressStatus === "started";

	const getStyles = () => {
		if (isCompleted) return "bg-[#BCEC30] text-white";
		if (isStarted) return "bg-[#FFF3CD] text-black";
		return "bg-[#F7F7F7] text-black";
	};

	const getIcon = () => {
		if (isCompleted) return "✅";
		if (isStarted) return "🟡";
		return "";
	};

	return (
		<Link
			to={`/training/${courseId}/${trainingId}`}
			className={`p-3 rounded-[10px] text-[18px] font-medium ${getStyles()}`}
		>
			{name} {getIcon()}
		</Link>
	);
};

export default TrainingLink;