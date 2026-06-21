import { useState } from "react";

interface PasswordChangeProps {
    closeModal: () => void;
    onSubmit: () => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ closeModal: onSubmit }) => { // ✅ closeModal не используется, поэтому _ = unused
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(); // смена пароля — имитация, т.к. API не поддерживает
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-[24px] font-bold mb-4">Смена пароля</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Старый пароль"
                    className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Новый пароль"
                    className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
                />
                <button
                    type="submit"
                    className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px]"
                >
                    Изменить
                </button>
            </form>
        </div>
    );
};

export default PasswordChange;