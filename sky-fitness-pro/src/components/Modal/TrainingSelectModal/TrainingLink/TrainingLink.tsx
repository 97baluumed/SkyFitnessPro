import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRealQuantityWithoutExercises } from "../../../../utils/api";
import { useUser } from "../../../../hooks/useUser";

interface TrainingLinkProps {
	name: string;
	trainingId: string;
	courseId: string;
}

function TrainingLink({ name, trainingId, courseId }: TrainingLinkProps) {
	const [completedTraining, setCompletedTraining] = useState(false);
	const { user } = useUser();

	useEffect(() => {
		if (user?.uid) {
			// Проверка на null
			getRealQuantityWithoutExercises(user.uid, courseId, trainingId)
				.then((data) => {
					if (data !== null) {
						setCompletedTraining(true);
					}
				})
				.catch((error: unknown) => console.error(error));
		}
	}, [user, courseId, trainingId]); // Добавлены зависимости

	return (
		<div className="flex gap-[10px] w-full text-start items-center border-b-2">
			<svg className="w-[24px] h-[24px]">
				<use xlinkHref={`./icon/sprite.svg#${completedTraining ? "icon-check" : "icon-uncheck"}`} />
			</svg>
			<Link to={`/training/${courseId}/${trainingId}`} className="w-[280px]">
				<p className="text-[14px] py-[10px]">{name}</p>
			</Link>
		</div>
	);
}

export default TrainingLink;
