import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { useUser } from '../../../../contexts/user';
import { BrowserRouter } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../../../../utils/api';

jest.mock('../../../../contexts/user');
jest.mock('../../../../utils/api');

describe('Login', () => {
    const closeModalMock = jest.fn();
    const toggleModalMock = jest.fn();
    const resetModalMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('отображает заголовок и поля', () => {
        const mockSetUser = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn(), setUser: mockSetUser });

        render(
            <BrowserRouter>
                <Login
                    closeModal={closeModalMock}
                    toggleModal={toggleModalMock}
                    resetModal={resetModalMock}
                />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Эл. почта')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
        expect(screen.getByText('Войти')).toBeInTheDocument();
        expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
    });

    test('обновляет email при вводе', () => {
        const mockSetUser = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn(), setUser: mockSetUser });

        render(
            <BrowserRouter>
                <Login
                    closeModal={closeModalMock}
                    toggleModal={toggleModalMock}
                    resetModal={resetModalMock}
                />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Эл. почта');
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(input).toHaveValue('test@example.com');
    });

    test('вызывает handleLogin при клике на кнопку "Войти"', async () => {
        const mockSetUser = jest.fn();
        (loginUser as jest.Mock).mockResolvedValue({ token: 'abc123' });
        (getCurrentUser as jest.Mock).mockResolvedValue({});
        (useUser as jest.Mock).mockReturnValue({
            user: null,
            logout: jest.fn(),
            setUser: mockSetUser,
        });

        render(
            <BrowserRouter>
                <Login
                    closeModal={closeModalMock}
                    toggleModal={toggleModalMock}
                    resetModal={resetModalMock}
                />
            </BrowserRouter>
        );

        const loginBtn = screen.getByText('Войти');
        fireEvent.click(loginBtn);

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalled();
            expect(getCurrentUser).toHaveBeenCalled();
            expect(mockSetUser).toHaveBeenCalled();
        });
    });
});