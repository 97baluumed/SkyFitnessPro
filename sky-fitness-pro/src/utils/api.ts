const BASE_URL = "https://fitness-pro-67b02-default-rtdb.europe-west1.firebasedatabase.app";

// ✅ Интерфейсы для типизации
export interface CourseType {
	courseId?: string;
	nameRu?: string;
	image?: string;
	workouts?: string[] | Record<string, true>; // ID тренировок
}

export interface TrainingType {
	id: string;
	_id: string;
	images: {
		cardImage: string;
		courseImage: string;
	};
	nameRU: string;
	description: string;
	directions: string[];
	fitting: string[];
}

export interface Exercise {
	_id: string;
	name: string;
	quantity: number;
	video: string;
}

// Используем Record<string, number> вместо any
export type ExerciseProgress = Record<string, number>;

// ✅ Добавить нового пользователя (обязательно для Register.tsx)
export const addUser = async (uid: string, name: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, uid }),
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Получить все курсы
export const getCourse = async (): Promise<Record<string, CourseType>> => {
	const res = await fetch(`${BASE_URL}/courses.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	return res.json();
};

// ✅ Получить курс по ID
export const getCourseById = async (id: string): Promise<CourseType> => {
	const res = await fetch(`${BASE_URL}/courses/${id}.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	return res.json();
};

// ✅ Получить тренировку по ID
export const getWorkoutsById = async (id: string): Promise<TrainingType> => {
	const res = await fetch(`${BASE_URL}/workouts/${id}.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	return res.json();
};

// ✅ Добавить курс пользователю
export const addCourseToUser = async (uid: string, courseId: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}.json`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: courseId }),
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Удалить курс у пользователя
export const deleteCourseToUser = async (uid: string, courseId: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}.json`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Получить список курсов пользователя
export const getUserCourses = async (uid: string): Promise<Record<string, CourseType> | null> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	const data = await res.json();
	return data !== null ? data : null;
};

// ✅ Получить данные курса пользователя (прогресс)
export const getUserCourse = async (uid: string, courseId: string): Promise<Record<string, { quantity: number }> | null> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	const data = await res.json();
	return data !== null ? data : null;
};

// ✅ Добавить прогресс (с упражнениями)
export const addRealQuantity = async (
	uid: string,
	courseId: string,
	workoutId: string,
	exercises: { name: string; quantity: number }[]
): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts/${workoutId}.json`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ exercises }),
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Получить прогресс (с упражнениями)
export const getRealQuantity = async (
	uid: string,
	courseId: string,
	workoutId: string
): Promise<number[]> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts/${workoutId}/exercises.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	const data: { quantity: number }[] | null = await res.json();
	if (!Array.isArray(data)) return [];
	return data.map((item) => item.quantity);
};

// ✅ Добавить прогресс (без упражнений)
export const addRealQuantityWithoutExercises = async (
	uid: string,
	courseId: string,
	workoutId: string,
	exercises: { [key: string]: { quantity: number } }
): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts/${workoutId}.json`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ exercises }),
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Получить прогресс (без упражнений)
export const getRealQuantityWithoutExercises = async (
	uid: string,
	courseId: string,
	workoutId: string
): Promise<number | null> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts/${workoutId}/exercises.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	const data = await res.json() as number | null;
	return data;
};

// ✅ Удалить прогресс
export const deleteProgress = async (uid: string, courseId: string): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}/courses/${courseId}/workouts.json`, {
		method: "DELETE",
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Добавить имя пользователя
export const addUserName = async (uid: string, name: string | undefined): Promise<void> => {
	const res = await fetch(`${BASE_URL}/users/${uid}.json`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name }),
	});
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
};

// ✅ Получить имя пользователя
export const getUserName = async (uid: string): Promise<{ name: string | undefined }> => {
	const res = await fetch(`${BASE_URL}/users/${uid}.json`);
	if (!res.ok) throw new Error(`Ошибка! Статус: ${res.status}`);
	return res.json();
};