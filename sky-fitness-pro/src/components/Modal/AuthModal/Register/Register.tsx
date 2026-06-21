// src/components/Modal/AuthModal/Register/Register.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../../../utils/api";
import { useUser } from "../../../../contexts/user";

export const Register = ({
    closeModal,
    setIsRegisterMode
}: {
    closeModal: () => void;
    setIsRegisterMode: (val: boolean) => void;
}) => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validatePassword = (pwd: string) => {
        // ✅ Упрощённая валидация: только длина
        if (pwd.length < 6) return "Пароль должен содержать не менее 6 символов";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Введите корректный email");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            await registerUser(email, password);
            const data = await loginUser(email, password);
            const token = data.token;
            setUser({ token, uid: token, name: email, email });
            closeModal();
            navigate("/profile");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Ошибка регистрации");
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <p className="text-[24px] font-bold mb-4">Регистрация</p>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 w-full">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        className="w-full h-[52px] border border-gray-300 rounded-[8px] p-[18px]"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                </div>
                <button
                    type="submit"
                    className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] bg-[#BCEC30] hover:bg-[#C6FF00] active:bg-[#000000] active:text-[#FFFFFF] rounded-[46px] mt-4"
                >
                    Зарегистрироваться
                </button>
            </form>
            <button
                onClick={() => setIsRegisterMode(false)}
                className="flex text-black text-lg font-normal flex-row justify-center items-center p-4 gap-2 w-full h-[52px] border border-black rounded-[46px] hover:bg-[#E9ECED] active:bg-[#000000] active:text-[#FFFFFF]"
            >
                Войти
            </button>
        </div>
    );
};

export default Register;