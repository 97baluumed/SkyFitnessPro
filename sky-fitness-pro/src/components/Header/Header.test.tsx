import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useUser } from '../../contexts/user';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../contexts/user');

describe('Header', () => {
    const openModalMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('отображает кнопку "Войти", если пользователь не залогинен', () => {
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });

        render(
            <BrowserRouter>
                <Header openModal={openModalMock} />
            </BrowserRouter>
        );

        expect(screen.getByText('Войти')).toBeInTheDocument();
    });

    test('открывает модальное окно при клике на кнопку "Войти"', () => {
        (useUser as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });

        render(
            <BrowserRouter>
                <Header openModal={openModalMock} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Войти'));
        expect(openModalMock).toHaveBeenCalledTimes(1);
    });

    test('отображает имя пользователя, если залогинен', () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { token: 'abc123', name: 'Иван', email: 'ivan@example.com' },
            logout: jest.fn(),
        });

        render(
            <BrowserRouter>
                <Header openModal={openModalMock} />
            </BrowserRouter>
        );

        const allNames = screen.getAllByText('Иван');
        expect(allNames.length).toBeGreaterThan(0);
    });

    test('открывает выпадающее меню при клике на аватар', () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { token: 'abc123', name: 'Иван', email: 'ivan@example.com' },
            logout: jest.fn(),
        });

        render(
            <BrowserRouter>
                <Header openModal={openModalMock} />
            </BrowserRouter>
        );

        const allNames = screen.getAllByText('Иван');
        const userBlock = allNames[0].closest('div');
        if (userBlock) {
            fireEvent.click(userBlock);
            expect(screen.getByText('Мой профиль')).toBeInTheDocument();
            expect(screen.getByText('Выйти')).toBeInTheDocument();
        }
    });
});