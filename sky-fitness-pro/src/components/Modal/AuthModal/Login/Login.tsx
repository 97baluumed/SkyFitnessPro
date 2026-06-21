import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../../../../utils/api";
import { useUser } from "../../../../contexts/user";

// === Вспомогательные функции для localStorage ===
const STORAGE_NAME_KEY = (email?: string) => `sky_fitness_user_name_${email}`;

interface ModalProps {
	closeModal: () => void;
	toggleModal: () => void;
	resetModal: () => void;
}

const Login: React.FC<ModalProps> = ({ closeModal, toggleModal, resetModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { setUser } = useUser();
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const { token } = await loginUser(email, password);
			await getCurrentUser(token);

			// ✅ Получаем имя из localStorage или email как fallback
			const storedName = localStorage.getItem(STORAGE_NAME_KEY(email));
			const name = storedName || email;

			// ❗ ДОБАВЛЕНО: сохраняем имя в localStorage, даже если оно = email
			localStorage.setItem(STORAGE_NAME_KEY(email), name);

			setUser({
				token,
				uid: email,
				name,
				email,
			});

			closeModal();
			navigate("/");
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Ошибка входа";
			if (errorMessage.includes("invalid email")) {
				setError("Некорректный email");
			} else if (errorMessage.includes("invalid credentials")) {
				setError("Неверный логин или пароль");
			} else {
				setError("Ошибка входа, попробуйте позже");
			}
		}
	};

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-10 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-2xl font-bold text-[#BCEC30]">LOGO</div>

				<div className="flex flex-col items-center w-[280px] h-[auto]">
					<div className="flex flex-col items-center gap-[10px] w-[280px] mb-6">
						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="email"
								placeholder="Эл. почта"
								className="text-[18px] w-full h-[49px] text-base font-normal text-gray-600 rounded-[8px] p-[18px]"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="password"
								placeholder="Пароль"
								className="text-[18px] w-full h-[49px] text-base font-normal text-gray-600 rounded-[8px] p-[18px]"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<p className="text-red-500 text-sm h-5">{error ? error : ""}</p>
					</div>

					<div className="flex flex-col items-center gap-2 w-[280px]">
						<button
							onClick={handleLogin}
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
						>
							Войти
						</button>

						<button
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
							onClick={toggleModal}
						>
							Зарегистрироваться
						</button>
					</div>
					<button className="text-md opacity-[50%] hover:underline mt-[8px] mb-[-8px]" onClick={resetModal}>
						Забыли пароль?
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;