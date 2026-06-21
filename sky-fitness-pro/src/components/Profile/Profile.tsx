import { useEffect, useState, useCallback } from "react";
import UserCards from "../Card/UserCards/UserCards";
import { useUser } from "../../contexts/user";
import { getCourseById, removeCourseFromUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { TrainingType } from "../../types/training";

const STORAGE_NAME_KEY = (email?: string) => `sky_fitness_user_name_${email}`;

function Profile() {
	const { user, logout, setUser } = useUser();
	const [name, setName] = useState<string>(() => {
		if (!user?.email) return "";
		const stored = localStorage.getItem(STORAGE_NAME_KEY(user.email));
		return stored || user.name || user.email;
	});

	const [isEditingName, setIsEditingName] = useState(false);
	const [courseInfoArray, setCourseInfoArray] = useState<TrainingType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const logoutUser = () => {
		logout();
		navigate("/");
	};

	const handleEditName = () => setIsEditingName(true);

	const handleSaveName = () => {
		if (name.trim() && user?.email) {
			const trimmedName = name.trim();
			localStorage.setItem(STORAGE_NAME_KEY(user.email), trimmedName);
			setUser({ ...user, name: trimmedName });
			setIsEditingName(false);
		} else {
			alert("Имя не может быть пустым");
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);

	const refetchCourses = useCallback(async () => {
		if (!user?.selectedCourses || user.selectedCourses.length === 0) {
			setCourseInfoArray([]);
			return;
		}

		const coursesData = await Promise.all(
			user.selectedCourses.map(async (courseId: string) => {
				try {
					const course = await getCourseById(courseId);
					return course;
				} catch (e) {
					console.warn(`Не удалось загрузить курс`, courseId, e);
					return null;
				}
			})
		);

		const validCourses = coursesData.filter(Boolean) as TrainingType[];
		setCourseInfoArray(validCourses);
	}, [user?.selectedCourses]);

	useEffect(() => {
		const controller = new AbortController();

		if (!user?.token) return;

		const fetchUserInfo = async () => {
			try {
				const API_BASE = "https://wedev-api.sky.pro/api/fitness";
				const res = await fetch(`${API_BASE}/users/me`, {
					headers: { Authorization: `Bearer ${user.token}` }
				});

				if (!res.ok) throw new Error(`API error: ${res.status}`);

				const userData = await res.json();

				if (userData.user?.selectedCourses) {
					setUser({
						...user,
						selectedCourses: userData.user.selectedCourses
					});
				}

				if (userData.user?.name) {
					setUser({
						...user,
						name: userData.user.name
					});
				}

				await refetchCourses();
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("Ошибка при получении данных пользователя:", error);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserInfo();

		return () => controller.abort();
	}, [user?.token]);

	useEffect(() => {
		if (user?.selectedCourses) {
			refetchCourses();
		}
	}, [user?.selectedCourses, refetchCourses]);

	const handleDeleteCourse = async (courseId: string) => {
		if (!user?.token) return;
		try {
			await removeCourseFromUser(user.token, courseId);
			const updatedSelectedCourses = user.selectedCourses?.filter((id: string) => id !== courseId);
			setUser({ ...user, selectedCourses: updatedSelectedCourses });
		} catch (error) {
			if (error instanceof Error && (error as Error).message.includes("не был добавлен")) {
				console.warn("Курс уже удалён:", courseId);
				return;
			}
			console.error("Ошибка при удалении курса:", error);
			alert("Ошибка при удалении курса");
		}
	};

	const scrollToCourses = () => {
		const element = document.getElementById("my_courses");
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (!user || isLoading) {
		return <p>Загрузка...</p>;
	}

	return (
		<div>
			<div className="mt-[40px] sm:mt-[60px]">
				<h2 className="text-[24px] sm:text-[40px] mb-[24px] sm:mb-[40px] font-medium text-left leading-none">
					Профиль
				</h2>

				<div className="flex flex-col sm:flex-row bg-[#FFFFFF] rounded-[28px] items-center px-[33px] py-[30px] sm:gap-[33px] shadow-[0px_4px_67px_-12px_#00000021]">
					<div>
						<img className="w-[141px] sm:w-[197px]" src="./profile-photo.svg" alt="profile-photo" />
					</div>

					<div className="flex-col items-start mt-[28px] sm:mt-[0px]">
						<div className="flex flex-row gap-[15px]">
							{isEditingName ? (
								<input
									type="text"
									value={name}
									onChange={handleNameChange}
									placeholder="Указать имя"
									className="text-[24px] sm:text-[32px] text-start mb-[18px] sm:mb-[30px] text-[#999999] border-solid border-[1px] border-[#D3D3D3] rounded-[8px] outline-none pl-1.5"
								/>
							) : (
								<p className="text-[24px] sm:text-[32px] font-medium text-start mb-[18px] sm:mb-[30px]">
									{name}
								</p>
							)}
							<button
								className="flex items-end h-[48px]"
								onClick={isEditingName ? handleSaveName : handleEditName}
							>
								<svg className="w-[35px] h-[35px]">
									{isEditingName ? (
										<use xlinkHref="./icon/sprite.svg#icon-save" />
									) : (
										<use xlinkHref="./icon/sprite.svg#icon-pencil" />
									)}
								</svg>
							</button>
						</div>

						<div className="flex flex-col items-start mb-[20px] sm:mb-[30px]">
							<p>Логин: {user?.email}</p>
						</div>

						<div className="flex-col flex sm:flex-row gap-[10px]">
							<button
								onClick={logoutUser}
								className="w-[300px] h-[50px] sm:w-[192px] sm:h-[52px] border border-black bg-[#ffffff] rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF] text-lg"
							>
								Выйти
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-[24px] sm:mt-[60px]">
				<h2 id="my_courses" className="text-[24px] sm:text-[40px] mb-[24px] sm:mb-[40px] font-medium text-left leading-none">
					Мои курсы
				</h2>
				<div className="flex flex-row flex-wrap gap-10 justify-start">
					{courseInfoArray.length > 0 ? (
						courseInfoArray.map((courseItem: TrainingType) => (
							<UserCards
								key={courseItem._id}
								courseId={courseItem._id}
								image={courseItem.images?.cardImage || "/zagl.jpg"}
								nameRu={courseItem.nameRU}
								onDelete={handleDeleteCourse}
							/>
						))
					) : isLoading ? (
						<p>Страница загружается...</p>
					) : (
						<p>У вас пока нет активных курсов</p>
					)}
				</div>

				<div className="lg:hidden flex flex-row justify-end mt-[24px]">
					<button
						onClick={scrollToCourses}
						className="bg-[#FFEB00] rounded-full w-[76px] h-[76px] flex items-center justify-center shadow-[0px_0px_44px_#4B4B4B66]"
					>
						<svg className="w-[37px] h-[30px]">
							<use xlinkHref="./icon/sprite.svg#icon-arrow-down" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Profile;