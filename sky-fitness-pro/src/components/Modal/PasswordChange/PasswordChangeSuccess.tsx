interface PasswordChangeSuccessProps {
	closeModal: () => void;
}

const PasswordChangeSuccess: React.FC<PasswordChangeSuccessProps> = ({ closeModal }) => {
	return (
		<div className="flex flex-col items-center gap-4 w-full">
			<p className="text-[24px] font-bold mb-4">Пароль изменён!</p>
			<button
				onClick={closeModal}
				className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
			>
				OK
			</button>
		</div>
	);
};

export default PasswordChangeSuccess;