import { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../../src/utils/firebase";
import { User } from "firebase/auth";

function getUserFromLocalStorage() {
	try {
		return JSON.parse(localStorage.getItem("user") || "null");
	} catch (error) {
		return null;
	}
}

export interface UserProp {
	user: User | null;
	name: string | undefined;
	loginUser(newUser: User): void;
	logoutUser(): void;
	updateUserName(newName: string): void;
}

export const UserContext = createContext<UserProp>({} as UserProp);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState(getUserFromLocalStorage());
	const [name, setName] = useState<string | undefined>(user?.displayName);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				localStorage.setItem("user", JSON.stringify(firebaseUser));
				setName(firebaseUser.displayName || undefined); // Установите имя, если доступно
			} else {
				setUser(null);
				setName(undefined);
				localStorage.removeItem("user");
			}
		});

		return () => unsubscribe();
	}, []);

	function loginUser(newUser: User) {
		setUser(newUser);
		localStorage.setItem("user", JSON.stringify(newUser));
		setName(newUser.displayName || undefined); // Установите имя при входе
	}

	function logoutUser() {
		setUser(null);
		setName(undefined);
		localStorage.removeItem("user");
	}

	async function updateUserName(newName: string) {
		if (user) {
			try {
				await user.updateProfile({ displayName: newName });
				setName(newName);
				localStorage.setItem("user", JSON.stringify({ ...user, displayName: newName }));
			} catch (error) {
				console.error("Ошибка при обновлении имени:", error);
			}
		}
	}

	return (
		<UserContext.Provider value={{ user, name, loginUser, logoutUser, updateUserName }}>
			{children}
		</UserContext.Provider>
	);
};
