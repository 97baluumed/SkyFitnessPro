import React, { useState } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../utils/firebase";

interface ModalProps {
	closeModal: () => void;
	onSubmit: () => void;
}

const PasswordChange: React.FC<ModalProps> = ({ closeModal, onSubmit }) => {
	const [newPassword, setNewPassword] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleChangePassword = async (): Promise<void> => {
		const user = auth.currentUser;

		if (user) {
			try {
				// Реаутентификация пользователя, если это требуется
				const credential = EmailAuthProvider.credential(user.email as string, oldPassword);
				await reauthenticateWithCredential(user, credential);

				// Обновление пароля
				await updatePassword(user, newPassword).then(() => {
					onSubmit();
				});
			} catch (error: unknown) {
				if (error instanceof Error) {
					setMessage("Ошибка при изменении пароля: " + error.message);
				}
			}
		} else {
			setMessage("Пользователь не авторизован.");
		}
	};

	return (
		<div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-12 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<img src="/logo.svg" alt="logo" />

				<div className="flex flex-col items-center gap-8 w-[280px] h-[auto]">
					<div className="flex flex-col items-start gap-[10px] w-[280px]">
						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="password"
								placeholder="Введите текущий пароль"
								className="text-[18px] w-full h-[49px] text-base font-normal text-black-400 rounded-[8px] p-[18px]"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>
						</div>

						<div className="flex flex-row items-center gap-2 w-[280px] h-[52px] border border-gray-300 rounded-[8px]">
							<input
								type="password"
								placeholder="Введите новый пароль"
								className="text-[18px] w-full h-[49px] text-base font-normal text-black-400 rounded-[8px] p-[18px]"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex flex-col items-center gap-4 w-[280px]">
						<button
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
							onClick={handleChangePassword}
						>
							Подтвердить
						</button>
						{message && <p>{message}</p>}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PasswordChange;
