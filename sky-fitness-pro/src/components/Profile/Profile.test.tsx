import fetchMock from 'jest-fetch-mock';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { useUser } from '../../contexts/user';
import { BrowserRouter } from 'react-router-dom';
import { getCourseById } from '../../utils/api';

jest.mock('../../contexts/user');
jest.mock('../../utils/api', () => ({
    getCourseById: jest.fn(),
    removeCourseFromUser: jest.fn(),
}));

afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.resetMocks();
});

describe('Profile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();

        fetchMock.mockResponse(JSON.stringify({
            user: {
                selectedCourses: ['course1'],
                name: 'Иван',
            }
        }));
    });

    test('отображает загрузку при отсутствии токена', () => {
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn(), setUser: jest.fn() });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    });

    test('отображает форму редактирования имени', async () => {
        (useUser as jest.Mock).mockReturnValue({
            user: {
                token: 'abc123',
                name: 'Иван',
                email: 'ivan@example.com',
                selectedCourses: [],
            },
            logout: jest.fn(),
            setUser: jest.fn(),
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Иван')).toBeInTheDocument();
        });
    });

    test('при клике на кнопку редактирования — показывает поле ввода', async () => {
        (useUser as jest.Mock).mockReturnValue({
            user: {
                token: 'abc123',
                name: 'Иван',
                email: 'ivan@example.com',
                selectedCourses: [],
            },
            logout: jest.fn(),
            setUser: jest.fn(),
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            const pencilButton = screen.getByRole('button', { name: /Редактировать имя/i });
            fireEvent.click(pencilButton);

            expect(screen.getByPlaceholderText('Указать имя')).toBeInTheDocument();
        });
    });

    test('показывает список курсов, если они есть', async () => {
        const mockCourse = {
            _id: '123',
            nameRU: 'Йога',
            images: { cardImage: '/yoga.jpg' },
        };
        (getCourseById as jest.Mock).mockResolvedValue(mockCourse);

        (useUser as jest.Mock).mockReturnValue({
            user: {
                token: 'abc123',
                name: 'Иван',
                email: 'ivan@example.com',
                selectedCourses: ['123'],
            },
            logout: jest.fn(),
            setUser: jest.fn(),
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Йога')).toBeInTheDocument();
        });
    });
});