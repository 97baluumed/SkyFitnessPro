import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useUser } from "../../hooks/useUser";
import { getUserName } from "../../utils/api";

interface HeaderProps {
	openModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openModal }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const { user, logoutUser } = useUser();
	const [name, setName] = useState(user?.displayName || "");
	const navigate = useNavigate();

	const toggleModal = () => {
		setModalVisible((prevModalVisible) => !prevModalVisible);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			setModalVisible(false);
		}
	};

	useEffect(() => {
		if (user?.uid) {
			getUserName(user.uid).then((data) => {
				setName(data?.name || "");
			});
		}
	}, [user]);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="header flex flex-row justify-between relative">
			<Link to={"/"} className="headerLogo">
				<img className="w-56 h-9 mb-[15px]" src="/logo.svg" alt="logo" />
				<p className="hidden sm:block text-lg opacity-50">Онлайн-тренировки для занятий дома</p>
			</Link>
			<div className="headerButton">
				<div
					ref={modalRef}
					className={
						modalVisible
							? "w-[266px] p-[30px] mt-[24px] bg-white rounded-[28px] absolute z-20 right-0 shadow-[0px_4px_67px_-12px_#00000021]"
							: "hidden"
					}
				>
					<div className="mb-[30px] flex gap-[10px] flex-col">
						<p data-testid="user-email" className="hidden sm:block text-[24px]">{name || user?.email || "Default Name"}</p>
						<p className="text-[16px] font-normal text-center text-[#999999]">{user?.email}</p>
					</div>

					<div className="flex flex-col items-center gap-4">
						<Link
							to={"/profile"}
							onClick={toggleModal}
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
						>
							Мой профиль
						</Link>

						<button
							onClick={() =>
								signOut(auth).then(() => {
									toggleModal();
									logoutUser();
									navigate("/");
								})
							}
							className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
						>
							Выйти
						</button>
					</div>
				</div>
				{user ? (
					<div onClick={toggleModal} className="flex gap-[12px] items-center cursor-pointer">
						<img src="/profile-photo-mini.svg" alt="profile-photo-mini" />
						<p className="hidden sm:block text-[24px]">{name || user?.email || "Default Name"}</p>

						<svg
							className="hidden sm:block"
							width="14"
							height="9"
							viewBox="0 0 14 9"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M12.3553 1.03308L6.67773 6.7107L1.00012 1.03308" stroke="black" strokeWidth="2" />
						</svg>
					</div>
				) : (
					<button
						onClick={openModal}
						className="bg-[#BCEC30] px-[16px] py-[8px] sm:px-[26px] rounded-[46px] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] text-[18px] sm:text-lg sm:h-[52px]"
					>
						Войти
					</button>
				)}
			</div>
		</div>
	);
};

export default Header;
