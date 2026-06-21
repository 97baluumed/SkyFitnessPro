import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../../../utils/firebase";
import { addUser } from "../../../../utils/api";

interface ModalProps {
	closeModal: () => void;
	toggleModal: () => void;
}

const Register: React.FC<ModalProps> = ({ closeModal, toggleModal }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [copyPassword, setcopyPassword] = useState("");
	const [error, setError] = useState("");

	function register() {
		if (password !== copyPassword) {
			setError("Пароли не совпадают");
			return;
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log(userCredential);
				setEmail("");
				setPassword("");
				setcopyPassword("");
				addUser(userCredential.user.uid);
				closeModal();
			})
			.catch((error: unknown) => {
				if (error instanceof Error) {
					if (error.message === "Firebase: Error (auth/invalid-email).") {
						setError("email введен некорректно");
					} else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
						setError("Пароль должен быть не менее 6 символов");
					} else {
						setError("Ошибка регистрации, попробуйте позже");
					}
				}
			});
	}

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-12 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<img src="/logo.svg" alt="logo" />

				<div className="flex flex-col items-center gap-8 w-[280px] h-[auto]">
					<div className="flex flex-col items-center gap-[10px] w-[280px]">
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

						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="password"
								placeholder="Повторите пароль"
								className="text-[18px] w-full h-[49px] text-base font-normal text-black-400 rounded-[8px] p-[18px]"
								value={copyPassword}
								onChange={(e) => setcopyPassword(e.target.value)}
							/>
						</div>
						<p>{error ? error : ""}</p>
					</div>

					<div className="flex flex-col items-center gap-2 w-[280px]">
						<button
							onClick={register}
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
						>
							Зарегистрироваться
						</button>

						<button
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
							onClick={toggleModal}
						>
							Войти
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
