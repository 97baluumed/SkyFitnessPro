import { useParams } from "react-router-dom";
import { addCourseToUser, getCourseById, getUserCourses } from "../../utils/api";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser"; // ← здесь нет setUser!
import { TrainingType } from "../../types/training";

interface CoursePageProps {
	openModal: () => void;
}

function CoursePage({ openModal }: CoursePageProps) {
	const { id } = useParams();
	const [course, setCourse] = useState<TrainingType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [bgColor, setBgColor] = useState("");
	const [specialClass, setSpecialClass] = useState("");
	const [isCourseAdded, setIsCourseAdded] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);

	const { user } = useUser(); // ← setUser здесь НЕТ!

	// 🔍 Получение курса с безопасной обработкой ошибок
	useEffect(() => {
		if (!id) return;

		setIsLoading(true);
		setError(null);

		getCourseById(id)
			.then((data) => {
				if (!data || typeof data !== "object") {
					setError("Курс не найден");
					return;
				}

				// ✅ Убрана строгая проверка images — она опциональна!
				setCourse(data);
			})
			.catch((err) => {
				console.error("❌ Ошибка при загрузке курса:", err);
				setError("Не удалось загрузить курс. Проверьте консоль.");
			})
			.finally(() => setIsLoading(false));
	}, [id]);

	// ✅ Проверка, добавлен ли курс
	useEffect(() => {
		if (user?.token) {
			getUserCourses(user.token)
				.then((data) => {
					if (
						data &&
						typeof data === "object" &&
						"selectedCourses" in data &&
						Array.isArray(data.selectedCourses)
					) {
						const courseExists = (data.selectedCourses as string[]).includes(id!);
						if (courseExists) {
							setIsCourseAdded(true);
							setIsButtonDisabled(true);
						}
					}
				})
				.catch((e) => console.warn("⚠️ Ошибка при проверке добавленных курсов:", e));
		}
	}, [user?.token, id]);

	// ✅ Исправлено: используем user.token, а не user.uid
	function addCourse() {
		if (!user?.token || !course?._id) {
			console.error("❌ Ошибка: отсутствует token или course._id");
			return;
		}

		addCourseToUser(user.token, course._id)
			.then(() => {
				setIsCourseAdded(true);
				setIsButtonDisabled(true);
				// ✅ Убрано setUser — его нет в useUser хук!
				// setUser({ ...user, selectedCourses: [...] })
			})
			.catch((error) => {
				console.error("❌ Ошибка при добавлении курса:", error);
			});
	}

	// ✅ Установка цвета фона по ID курса
	useEffect(() => {
		if (!id) return;
		let bg_color = "";
		switch (id) {
			case "ab1c3f": bg_color = "#FFC700"; break;
			case "fi67sm": bg_color = "#FF7E65"; break;
			case "kfpq8e": bg_color = "#2491D2"; break;
			case "q02a6i": bg_color = "#7D458C"; break;
			case "ypox9r": bg_color = "#F7A012"; break;
			default: bg_color = "#FFC700";
		}
		setBgColor(bg_color);
	}, [id]);

	// ✅ Установка специальных классов для адаптивности
	useEffect(() => {
		if (!id) return;
		const specialIds = ["fi67sm", "q02a6i"];
		const className = specialIds.includes(id) ? "mb-10" : "md:mr-[70px]";
		setSpecialClass((prev) => (prev ? `${prev} ${className}` : className));
	}, [id]);

	// 🛡️ Безопасный рендеринг
	return (
		<>
			<div className="mt-[40px] sm:mt-[60px]">
				{isLoading ? (
					<p>Загрузка курса...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : course ? (
					<div>
						<div>
							{course.images && typeof course.images === "object" && (
								<>
									{/* Мобильная версия */}
									<div
										className={`block sm:hidden w-full h-[350px] rounded-[20px] flex items-end justify-center`}
										style={{ backgroundColor: bgColor }}
									>
										<div className="overflow-hidden rounded-[20px]">
											<img
												src={course.images.cardImage}
												alt="card-img"
												className={specialClass}
											/>
										</div>
									</div>

									{/* Десктоп */}
									<div
										className={`hidden sm:flex w-full h-[200px] sm:h-[310px] justify-between rounded-[20px] mt-[40px] sm:mt-[60px]`}
										style={{ backgroundColor: bgColor }}
									>
										<p className="text-white text-[45px] text-start md:text-[60px] font-bold p-[30px] md:p-[40px]">
											{course.nameRU}
										</p>
										<div className="overflow-hidden relative rounded-[20px]">
											<img
												src={course.images.courseImage}
												alt="card-img"
												className={specialClass}
											/>
										</div>
									</div>
								</>
							)}
						</div>

						<div className="mt-[40px] sm:mt-[60px]">
							<h2 className="text-[24px] sm:text-[40px] mb-[25px] sm:mb-[40px] font-medium text-left leading-none">
								Подойдет для вас, если:
							</h2>

							<div className="flex flex-col xl:flex-row mt-[20px] sm:mt-[40px] gap-[17px] justify-between">
								{course.fitting?.map((fitting: string, index: number) => (
									<div
										key={index}
										className="w-full xl:w-[368px] h-[141px] md:h-[110px] xl:h-[160px] pl-[15px] pr-[15px] flex bg-gradient-to-r from-[#151720] to-[#1E212E] items-center rounded-[20px]"
									>
										<p className="text-[#BCEC30] text-[75px] font-medium">{index + 1}</p>
										<p className="text-left text-white text-[18px] sm:text-[24px] ml-[15px] sm:ml-[25px] leading-7">
											{fitting}
										</p>
									</div>
								))}
							</div>

							<h2 className="text-[24px] sm:text-[40px] mt-[40px] sm:mt-[60px] mb-[25px] sm:mb-[40px] font-medium text-left leading-none">
								Направления
							</h2>

							<div className="bg-[#BCEC30] lg:grid lg:grid-cols-3 grid-rows-2 gap-4 p-[20px] md:p-[50px] w-full h-auto lg:h-[146px] lg:p-[30px] rounded-[20px] items-center">
								{course.directions?.map((directions: string, index: number) => (
									<p key={index} className="text-[18px] sm:text-[24px] md:text-[28px] text-left">
										✦ {directions}
									</p>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="mt-[156px] sm:mt-[102px] bg-white flex relative rounded-[20px] overflow-hidden shadow-[0px_4px_67px_-12px_#00000021] z-30">
								<div className="p-[30px] sm:p-[40px] h-auto lg:h-[486px] z-20">
									<div className="w-full lg:w-[437px]">
										<h2 className="lg:pr-[40px] text-[32px] sm:text-[34px] md:text-[46px] lg:text-[56px] font-medium text-left leading-none mb-[20px] sm:mb-[28px]">
											Начните путь к новому телу
										</h2>
										<div className="text-left text-[18px] sm:text-[22px] md:text-[24px] opacity-60">
											<div className="flex gap-2">
												<span>•</span>
												<p> проработка всех групп мышц</p>
											</div>
											<div className="flex gap-2">
												<span>•</span>
												<p> тренировка суставов</p>
											</div>
											<div className="flex gap-2">
												<span>•</span>
												<p> улучшение циркуляции крови</p>
											</div>
											<div className="flex gap-2">
												<span>•</span>
												<p> упражнения заряжают бодростью</p>
											</div>
											<div className="flex gap-2">
												<span>•</span>
												<p> помогают противостоять стрессам</p>
											</div>
										</div>

										{user?.token ? (
											<button
												onClick={addCourse}
												disabled={isButtonDisabled}
												className={`w-full h-[50px] rounded-[40px] md:text-lg mt-[20px] sm:mt-[28px] 
													${isButtonDisabled ? "bg-[#efffc0]" : "bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF]"}`}
											>
												{isCourseAdded ? "Курс добавлен" : "Добавить курс"}
											</button>
										) : (
											<button
												onClick={openModal}
												className="w-full h-[50px] bg-[#BCEC30] rounded-[40px] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] md:text-lg mt-[20px] sm:mt-[28px]"
											>
												Войдите, чтобы добавить курс
											</button>
										)}
									</div>
								</div>

								<img
									className="hidden absolute right-[15px] top-[50px] z-10 lg:block lg:opacity-[20%] xl:opacity-[100%]"
									src="/lines.svg"
									alt="lines"
								/>
							</div>

							<img
								className="absolute top-[-270px] right-[-72px] sm:top-[-420px] sm:right-[-90px] lg:right-[20px] lg:top-[-80px] lg:top-[-100px] z-20 lg:z-30"
								src="/men.png"
								alt="men"
							/>
							{/* SVG-элементы */}
							<svg className="sm:hidden top-[-177px] right-[165px] absolute z-10" width="30" height="28" viewBox="0 0 55 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 46.0947C6 37.5947 20.2 17.1947 53 3.59473" stroke="black" strokeWidth="6" />
							</svg>
							<svg className="sm:hidden top-[-135px] right-[-15px] absolute z-10" width="375" height="290" viewBox="0 0 375 290" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M306.773 252.122C592.337 -146.318 16.1411 27.4986 0.857649 155.11C-2.75302 185.258 38.2014 194.154 99.6254 180.667C161.049 167.18 -99.0882 266.476 20.3958 284.721" stroke="#C6FF00" strokeWidth="10.1395" />
							</svg>
							<svg className="hidden sm:block lg:hidden opacity-[30%] top-[-285px] right-[275px] absolute" width="43" height="42" viewBox="0 0 55 48" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3 46.0947C6 37.5947 20.2 17.1947 53 3.59473" stroke="black" strokeWidth="6" />
							</svg>
							<svg className="hidden sm:block lg:hidden opacity-[30%] top-[-185px] right-[-15px] absolute" width="562" height="435" viewBox="0 0 375 290" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M306.773 252.122C592.337 -146.318 16.1411 27.4986 0.857649 155.11C-2.75302 185.258 38.2014 194.154 99.6254 180.667C161.049 167.18 -99.0882 266.476 20.3958 284.721" stroke="#C6FF00" strokeWidth="10.1395" />
							</svg>
						</div>
					</div>
				) : (
					<p>Курс не найден</p>
				)}
			</div>
		</>
	);
}

export default CoursePage;