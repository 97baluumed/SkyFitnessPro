// src/utils/api.ts

const API_BASE = "https://wedev-api.sky.pro/api/fitness";

// === Аутентификация ===
export const registerUser = async (email: string, password: string) => {
	const res = await fetch(`${API_BASE}/auth/register`, {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText);
	}
};

export const loginUser = async (email: string, password: string): Promise<{ token: string }> => {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message);
	}

	return await res.json(); // { token: "..." }
};

export const getCurrentUser = async (token: string) => {
	const res = await fetch(`${API_BASE}/users/me`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Ошибка при получении данных пользователя");
	}

	return await res.json(); // { email, selectedCourses: [...] }
};

// === Курсы ===
export const getCourses = async () => {
	const res = await fetch(`${API_BASE}/courses`);
	return await res.json();
};

export const getCourseById = async (id?: string) => {
	if (!id) {
		console.warn("getCourseById: ID не передан");
		return null;
	}

	const res = await fetch(`${API_BASE}/courses/${id}`);
	if (!res.ok) {
		throw new Error(`Ошибка при получении курса с ID: ${id}`);
	}

	return await res.json();
};

export const getCourse = getCourseById;
export const getCourseByIdentifier = getCourseById;

// ✅ ИСПРАВЛЕНО: getWorkoutsByCourse теперь принимает token
export const getWorkoutsByCourse = async (courseId: string, token?: string) => {
	const headers: Record<string, string> = {};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	} else {
		console.warn("⚠️ Токен не передан! headers:", headers);
	}

	const res = await fetch(`${API_BASE}/courses/${courseId}/workouts`, {
		headers,
	});

	if (!res.ok) {
		const errorText = await res.text();
		console.error("❌ Ошибка API:", res.status, errorText);
		throw new Error(`Ошибка при получении тренировок курса ${courseId}: ${errorText}`);
	}

	return await res.json();
};

export const getWorkoutsById = getWorkoutsByCourse; // для совместимости

// === Курсы пользователя ===
export const addCourseToUser = async (token: string, courseId: string) => {
	if (!courseId) {
		throw new Error("courseId is required");
	}
	if (!token) {
		throw new Error("token is required");
	}

	const res = await fetch(`${API_BASE}/users/me/courses`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ courseId }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		try {
			const error = JSON.parse(errorText);
			throw new Error(error.message || errorText);
		} catch {
			throw new Error(`Ошибка при добавлении курса: ${errorText}`);
		}
	}

	return await res.json();
};

export const removeCourseFromUser = async (token: string, courseId: string): Promise<void> => {
	const res = await fetch(`${API_BASE}/users/me/courses/${courseId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	// ✅ Считаем 500 + "не был добавлен" — успешной операцией
	if (res.status === 500) {
		const errorText = await res.text();
		if (errorText.includes("не был добавлен")) {
			return; // не выбрасываем, не логируем
		}
	}

	if (!res.ok) {
		const errorText = await res.text();
		console.error(`❌ Ошибка при удалении курса ${courseId}:`, errorText);
		throw new Error(`Ошибка при удалении курса: ${errorText}`);
	}

	if (res.status === 204) return;
	return await res.json();
};

// Алиасы для совместимости
export const deleteCourseToUser = removeCourseFromUser;
export const getUserCourses = async (token: string) => {
	return await getCurrentUser(token);
};
export const deleteProgress = removeCourseFromUser;

// === Прогресс ===
export const getProgress = async (token: string, courseId: string, workoutId?: string) => {
	const url = workoutId
		? `${API_BASE}/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`
		: `${API_BASE}/users/me/progress?courseId=${courseId}`;

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Ошибка при получении прогресса");
	}

	return await res.json();
};

export const saveWorkoutProgress = async (
	token: string,
	courseId: string,
	workoutId: string,
	progressData: number[]
) => {
	const res = await fetch(`${API_BASE}/courses/${courseId}/workouts/${workoutId}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			// ❌ Убрали "Content-Type": "application/json"
		},
		body: JSON.stringify({ progressData }), // ✅ Массив, где i-й элемент = повторения для i-го упражнения
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Ошибка при сохранении прогресса: ${errorText}`);
	}

	return await res.json();
};



export const resetProgress = async (token: string, courseId: string) => {
	const res = await fetch(`${API_BASE}/users/me/progress?courseId=${courseId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Ошибка при сбросе прогресса");
	}

	return await res.json();
};

export const getWorkoutById = async (courseId: string, workoutId: string, token?: string) => {
	const headers: Record<string, string> = {};
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const res = await fetch(`${API_BASE}/courses/${courseId}/workouts/${workoutId}`, {
		headers,
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Ошибка при получении тренировки ${workoutId}: ${errorText}`);
	}

	return await res.json();
};

// ✅ ИСПРАВЛЕНО: Новая асинхронная функция для получения прогресса
export const getRealQuantityWithoutExercises = async (
	token: string,
	courseId: string,
	workoutId?: string
): Promise<number> => {
	const url = workoutId
		? `${API_BASE}/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`
		: `${API_BASE}/users/me/progress?courseId=${courseId}`;

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		throw new Error("Ошибка при получении прогресса");
	}

	const data = await res.json();

	// В зависимости от ответа API:
	// Если data = { progress: 3 } или data = 3
	if (typeof data === "number") return data;
	if (typeof data?.progress === "number") return data.progress;

	return 0;
};

// === Вспомогательные функции (для обработки строк и количества) — переименованы, чтобы не конфликтовать ===
// Используются в TrainingProgressItem для placeholder и ввода
export const extractQuantityFromString = (text: string): number => {
	if (!text) return 0;
	const match = text.match(/\d+/);
	return match ? parseInt(match[0], 10) : 0;
};

export const addRealQuantityWithoutExercises = (text: string): string => {
	if (!text) return "";
	const quantity = extractQuantityFromString(text);
	if (quantity === 0) return text;

	const prefix = text.replace(/\d+/, "");
	if (!prefix.trim()) return `${quantity} ${text}`;

	return prefix.trim() === "" ? `${quantity} ${text}` : text;
};

export const addRealQuantity = async (
	token: string,
	courseId: string,
	workoutId: string,
	quantityText: string
): Promise<void> => {
	const quantity = extractQuantityFromString(quantityText);

	if (quantity === 0) {
		throw new Error("Не удалось извлечь количество из строки");
	}

	const progressData = Array.from({ length: quantity }, (_, i) => i + 1);
	await saveWorkoutProgress(token, courseId, workoutId, progressData);
};

// Алиасы — для совместимости
export const getRealQuantity = getRealQuantityWithoutExercises;
