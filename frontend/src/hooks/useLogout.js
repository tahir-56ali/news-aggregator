import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const useLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result && result.success) {
            navigate('/login');
        }
    };

    return handleLogout;
};

export default useLogout;
