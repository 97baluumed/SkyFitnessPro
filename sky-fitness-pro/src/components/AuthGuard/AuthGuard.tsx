import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/user';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoadingUser } = useUser();

    if (isLoadingUser) {
        return <p>Загрузка...</p>;
    }

    if (!user?.token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AuthGuard;