// src/app/Main/Main.tsx

import { useEffect, useState } from "react";
import { getCourses } from "../../utils/api";
import Card from "../../components/Card/Card";
import { TrainingType } from "../../types/training";

// ✅ Вынесли вне компонента, чтобы избежать проблем с deps
const COURSE_ORDER = ["ab1c3f", "kfpq8e", "ypox9r", "fi67sm", "q02a6i"];

function Main() {
	const scrollToCourses = () => {
		const element = document.getElementById("top");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	// ✅ Исправлено: case "fi67sm" вместо "6i67sm"
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

	const [isLoaded, setIsLoaded] = useState(false);
	const [courses, setCourses] = useState<TrainingType[]>([]);

	useEffect(() => {
		getCourses()
			.then((data: Record<string, TrainingType>) => {
				if (!data || typeof data !== "object") {
					setCourses([]);
					return;
				}

				const coursesData: TrainingType[] = Object.values(data)
					.filter((item): item is TrainingType => item != null);

				coursesData.sort((a, b) =>
					COURSE_ORDER.indexOf(a._id) - COURSE_ORDER.indexOf(b._id)
				);

				setCourses(coursesData);
			})
			.catch(() => {
				setCourses([]);
			})
			.finally(() => {
				setIsLoaded(true);
			});
	}, []);

	return (
		<>
			<div
				id="top"
				className="description flex flex-row mb-[34px] justify-between h-[120px] mt-[39px] sm:mt-[60px] sm:mb-[50px]"
			>
				<h1 className="text-[32px] sm:text-[42px] xl:text-[60px] font-medium text-left leading-none">
					Начните заниматься спортом и улучшите качество жизни
				</h1>
				<img className="h-[120px] hidden lg:block" src="/description-img.svg" alt="description" />
			</div>
			{isLoaded ? (
				<div className="flex justify-center xl:justify-start flex-wrap gap-6 sm:gap-10">
					{courses.length > 0 ? (
						courses.map((course) => (
							<Card
								key={course._id}
								courseId={course._id}
								image={getImageByCourseId(course._id)}
								nameRu={course.nameRU}
							/>
						))
					) : (
						<p>Нет доступных курсов</p>
					)}
				</div>
			) : (
				<p>Страница загружается</p>
			)}
			<div className="flex flex-row justify-center mt-[34px] mb-[81px]">
				<button
					onClick={scrollToCourses}
					className="w-[127px] h-[52px] bg-[#BCEC30] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] text-lg leading-3"
				>
					Наверх
				</button>
			</div>
		</>
	);
}

export default Main;