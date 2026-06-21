import React, { useState } from "react";
import Login from "./Login/Login";
import Register from "./Register/Register";
import ResetPassword from "./ResetPassword/ResetPassword";

interface AuthModalProps {
	closeModal: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [isReset, setIsReset] = useState(false);

	const toggleModal = () => {
		setIsLogin((prev) => !prev);
	};

	const resetModal = () => {
		setIsReset((prev) => !prev);
	};

	return (
		<div className="fixed z-40 inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
			<div
				className="relative p-10 gap-12 w-[360px] bg-white shadow-lg rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				{isReset ? (
					<ResetPassword closeModal={closeModal} />
				) : isLogin ? (
					<Login toggleModal={toggleModal} closeModal={closeModal} resetModal={resetModal} />
				) : (
					<Register toggleModal={toggleModal} closeModal={closeModal} />
				)}
			</div>
		</div>
	);
};

export default AuthModal;
