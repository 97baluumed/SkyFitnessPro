import React from "react";

interface ModalProps {
	closeModal: () => void;
}

const AddCourseModal: React.FC<ModalProps> = ({ closeModal }) => {
	return (
		<div className="fixed z-40 inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50" onClick={closeModal}>
			<div
				className="relative flex flex-col items-center p-10 gap-12 w-[360px] h-[auto] bg-white shadow-[0_4px_67px_-12px_rgba(0,0,0,0.13)] rounded-[30px]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex flex-col items-center gap-8 w-[280px] h-[auto]">
					<h2 className="text-[32px] font-medium text-center">Курс успешно добавлен!</h2>

					<svg
						className="mb-[10px]"
						width="57"
						height="58"
						viewBox="0 0 57 58"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M28.5 57.3337C44.1481 57.3337 56.8333 44.6484 56.8333 29.0003C56.8333 13.3523 44.1481 0.666992 28.5 0.666992C12.8519 0.666992 0.166672 13.3523 0.166672 29.0003C0.166672 44.6484 12.8519 57.3337 28.5 57.3337ZM28.2546 40.7472L43.8379 22.3305L39.5121 18.6702L26.0557 34.5732L18.3073 25.7179L14.0427 29.4494L23.9594 40.7828C24.5028 41.4038 25.29 41.7571 26.1152 41.7502C26.9403 41.7434 27.7216 41.3771 28.2546 40.7472Z"
							fill="#BCEC30"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default AddCourseModal;
