import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CoursePage from './CoursePage';
import { useUser } from '../../hooks/useUser';
import { UserProp } from '../../contexts/user';

// Мокаем хук useUser
jest.mock('../../hooks/useUser');

describe('CoursePage', () => {
    const mockOpenModal = jest.fn();

    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({ user: null } as UserProp);
    });

    it('snapshot', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/course/ab1c3f']}>
                <CoursePage openModal={mockOpenModal} />
            </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    });
});
