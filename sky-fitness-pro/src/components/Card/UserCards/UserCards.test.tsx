import fetchMock from 'jest-fetch-mock';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserCards from './UserCards';
import { useUser } from '../../../contexts/user';
import { getWorkoutsByCourse, getProgress } from '../../../utils/api';

jest.mock('../../../contexts/user');
jest.mock('../../../utils/api');

describe('UserCards', () => {
    const courseId = 'ypox9r';
    const nameRu = 'Фитнес';
    const onDeleteMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
    });

    test('отображает карточку при наличии данных', async () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { uid: 'uid123', token: 'token123' },
        });
        (getWorkoutsByCourse as jest.Mock).mockResolvedValue([
            { _id: 'workout1', nameRU: 'Разминка' },
        ]);
        (getProgress as jest.Mock).mockResolvedValue({ progressData: [50] });

        render(
            <UserCards
                courseId={courseId}
                nameRu={nameRu}
                image="/fitness.jpg"
                onDelete={onDeleteMock}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Фитнес')).toBeInTheDocument();
            expect(screen.getByText('Прогресс 50%')).toBeInTheDocument();
        });
    });

    test('вызывает onDelete при клике на кнопку удаления', async () => {
        (useUser as jest.Mock).mockReturnValue({
            user: { uid: 'uid123', token: 'token123' },
        });
        (getWorkoutsByCourse as jest.Mock).mockResolvedValue([]);
        (getProgress as jest.Mock).mockResolvedValue({ progressData: [] });

        render(
            <UserCards
                courseId={courseId}
                nameRu={nameRu}
                image="/fitness.jpg"
                onDelete={onDeleteMock}
            />
        );

        await waitFor(() => {
            const deleteBtn = screen.getByTitle('Удалить курс');
            fireEvent.click(deleteBtn);
        });

        expect(onDeleteMock).toHaveBeenCalledWith(courseId);
    });
});