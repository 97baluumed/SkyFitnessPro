import { Exercise } from "../../../types/training";

interface ExerciseProgressProps {
	exercise: Exercise;
	progress: number;
}

function ExerciseProgress({ exercise, progress }: ExerciseProgressProps) {
	const requiredProgress = exercise.quantity;
	const progressPercentage = (progress / requiredProgress) * 100;

	return (
		<div className="flex flex-col w-[320px] xl:h-[73px] h-[55px] justify-between">
			<div className="xl:text-lg lg:text-md text-sm text-start">{exercise.name}</div>
			<div className="relative w-full h-[6px] bg-gray-300 rounded-full">
				<div
					data-testid="progress-bar"
					className="absolute top-0 left-0 h-[6px] bg-[#00C1FF] rounded-full"
					style={{ width: `${progressPercentage < 100 ? progressPercentage : 100}%` }}
				></div>
			</div>
		</div>
	);
}

export default ExerciseProgress;
