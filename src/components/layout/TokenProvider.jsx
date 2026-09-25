import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { base44 } from '@/api/base44Client';

export default function TokenProvider({ children }) {
    const { getToken } = useAuth();
    
    useEffect(() => {
        base44.setTokenGetter(getToken);
    }, [getToken]);

    return children;
}
