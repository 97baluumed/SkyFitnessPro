import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../../../utils/firebase";
import { useUser } from "../../../../hooks/useUser";

interface ModalProps {
	closeModal: () => void;
	toggleModal: () => void;
	resetModal: () => void;
}

const Login: React.FC<ModalProps> = ({ closeModal, toggleModal, resetModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { loginUser } = useUser();

	function login() {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log(userCredential);
				setEmail("");
				setPassword("");
				closeModal();
				const currentUser = auth.currentUser;
				if (currentUser) {
					loginUser(currentUser);
				} else {
					setError("Пользователь не найден");
				}
			})
			.catch((error: unknown) => {
				if (error instanceof Error) {
					if (error.message === "Firebase: Error (auth/invalid-email).") {
						setError("email введен некорректно");
					} else if (error.message === "Firebase: Error (auth/invalid-credential).") {
						setError("Неверный логин или пароль");
					} else {
						setError("Ошибка входа, попробуйте позже");
					}
				} else {
					setError("Ошибка входа, попробуйте позже");
				}
			});
	}

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-10 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<img src="/logo.svg" alt="logo" />

				<div className="flex flex-col items-center w-[280px] h-[auto]">
					<div className="flex flex-col items-center gap-[10px] w-[280px] mb-6">
						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="email"
								placeholder="Эл. почта"
								className="text-[18px] w-full h-[49px] text-base font-normal text-black-400 rounded-[8px] p-[18px]"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="password"
								placeholder="Пароль"
								className="text-[18px] w-full h-[49px] text-base font-normal text-black-400 rounded-[8px] p-[18px]"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<p>{error ? error : ""}</p>
					</div>

					<div className="flex flex-col items-center gap-2 w-[280px]">
						<button
							onClick={login}
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
