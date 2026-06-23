import fetchMock from 'jest-fetch-mock';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { useUser } from '../../../../contexts/user';
import { BrowserRouter } from 'react-router-dom';
import { registerUser, loginUser, getCurrentUser } from '../../../../utils/api';

jest.mock('../../../../contexts/user');
jest.mock('../../../../utils/api');

describe('Register', () => {
    const closeModalMock = jest.fn();
    const setIsRegisterModeMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
    });

    test('отображает заголовок и поля', () => {
        const mockSetUser = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn(), setUser: mockSetUser });

        render(
            <BrowserRouter>
                <Register closeModal={closeModalMock} setIsRegisterMode={setIsRegisterModeMock} />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
        expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
    });

    test('показывает ошибку, если пароль < 6 символов', async () => {
        const mockSetUser = jest.fn();
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn(), setUser: mockSetUser });

        render(
            <BrowserRouter>
                <Register closeModal={closeModalMock} setIsRegisterMode={setIsRegisterModeMock} />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Пароль');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123' } });

        const submitBtn = screen.getByText('Зарегистрироваться');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Пароль должен содержать не менее 6 символов')).toBeInTheDocument();
        });
    });

    test('отправляет форму при корректных данных', async () => {
        const mockSetUser = jest.fn();
        (registerUser as jest.Mock).mockResolvedValue({});
        (loginUser as jest.Mock).mockResolvedValue({ token: 'abc123' });
        (getCurrentUser as jest.Mock).mockResolvedValue({});
        (useUser as jest.Mock).mockReturnValue({
            user: null,
            logout: jest.fn(),
            setUser: mockSetUser,
        });

        render(
            <BrowserRouter>
                <Register closeModal={closeModalMock} setIsRegisterMode={setIsRegisterModeMock} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Пароль'), { target: { value: 'password123' } });

        const submitBtn = screen.getByText('Зарегистрироваться');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockSetUser).toHaveBeenCalledWith({
                token: 'abc123',
                uid: 'abc123',
                name: 'test@example.com',
                email: 'test@example.com',
            });
        });
    });
});