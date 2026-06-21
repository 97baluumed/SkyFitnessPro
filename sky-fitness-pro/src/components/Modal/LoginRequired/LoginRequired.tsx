import React from "react";

interface ModalProps {
	closeModal: () => void;
}

const LoginRequired: React.FC<ModalProps> = ({ closeModal }) => {
	return (
		<div className="fixed z-40 inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-12 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col items-center gap-5 w-[280px] h-[auto]">
					<h2 className="text-[24px] font-medium text-center">Авторизуйтесь, чтобы добавить курс</h2>

					<svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
						<circle cx="28.5" cy="29" r="28.5" fill="#ecba30" />
						<rect x="25" y="15" width="7" height="23" fill="white" />
						<rect x="25" y="41" width="7" height="7" fill="white" />
					</svg>
				</div>
			</div>
		</div>
	);
};

export default LoginRequired;
