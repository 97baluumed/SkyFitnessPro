// src/contexts/user.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
	token: string;
	uid: string;
	name: string;
	email: string;
	selectedCourses?: string[];
};

interface UserContextType {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
	isLoadingUser: boolean; // ✅ Новое состояние
}

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => { },
	logout: () => { },
	isLoadingUser: true, // ✅ По умолчанию — загрузка
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true); // ✅ Новое состояние

	useEffect(() => {
		const storedUser = localStorage.getItem("fitness_user");
		const storedToken = localStorage.getItem("fitness_token");

		if (storedUser && storedToken) {
			try {
				const parsedUser = JSON.parse(storedUser);
				if (parsedUser.token === storedToken) {
					setUser(parsedUser);
				} else {
					localStorage.removeItem("fitness_user");
					localStorage.removeItem("fitness_token");
				}
			} catch {
				localStorage.removeItem("fitness_user");
				localStorage.removeItem("fitness_token");
			}
		}

		// ✅ Ставим загрузку в false ПОСЛЕ проверки (даже если user === null)
		setIsLoadingUser(false);
	}, []);

	const handleSetUser = (userData: User | null) => {
		setUser(userData);
		if (userData) {
			localStorage.setItem("fitness_user", JSON.stringify(userData));
			localStorage.setItem("fitness_token", userData.token);
		} else {
			localStorage.removeItem("fitness_user");
			localStorage.removeItem("fitness_token");
		}
	};

	const handleLogout = () => {
		handleSetUser(null);
	};

	return (
		<UserContext.Provider value={{ user, setUser: handleSetUser, logout: handleLogout, isLoadingUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within UserProvider");
	}
	return context;
};

export { UserContext };