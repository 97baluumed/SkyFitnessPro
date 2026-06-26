import React, { useState } from "react";
import Register from "./Register/Register";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/user";
import { loginUser } from "../../../utils/api";

interface AuthModalProps {
	closeModal: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal }) => {
	const [isRegisterMode, setIsRegisterMode] = useState(false);
	const { user, setUser } = useUser();
	const navigate = useNavigate();

	if (user) {
		closeModal();
		return null;
	}

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-10 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<img src="/logo.svg" alt="logo" />

				<div className="flex flex-col items-center gap-8 w-[280px]">
					{!isRegisterMode ? (
						<div className="flex flex-col items-center gap-4 w-full">
							<p className="text-[24px] font-bold mb-4">Вход</p>
							<div className="flex flex-col gap-2 w-full">
								<input
									type="email"
									placeholder="Email"
									id="login-email"
									className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
								/>
								<input
									type="password"
									placeholder="Пароль"
									id="login-password"
									className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
								/>
							</div>
							<button
								className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
								onClick={async () => {
									const emailInput = document.getElementById("login-email") as HTMLInputElement;
									const passInput = document.getElementById("login-password") as HTMLInputElement;
									const email = emailInput?.value.trim();
									const password = passInput?.value;

									if (!email || !password) {
										alert("Введите email и пароль");
										return;
									}

									try {
										const data = await loginUser(email, password);
										const token = data.token;

										if (!token) {
											alert("Токен не получен! Проверьте Network → auth/login → Response");
											return;
										}

										setUser({
											token,
											uid: token,
											name: email,
											email,
										});
										closeModal();
										navigate("/profile");
									} catch (error) {
										alert("Ошибка входа: " + (error as Error).message);
										console.error("Ошибка входа:", error);
									}
								}}
							>
								Войти
							</button>
							<button

								className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
								onClick={() => setIsRegisterMode(true)}
							>
								Зарегистрироваться
							</button>
						</div>
					) : (
						<Register closeModal={closeModal} setIsRegisterMode={setIsRegisterMode} />)}
				</div>
			</div>
		</div>
	);
};

export default AuthModal;