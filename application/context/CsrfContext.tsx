// contexts/CsrfContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface CsrfContextProps {
    csrfToken: string | null;
    setCsrfToken: (token: string | null) => void;
}

const CsrfContext = createContext<CsrfContextProps | undefined>(undefined);

export const CsrfProvider: React.FC = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    return (
        <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
            {children}
        </CsrfContext.Provider>
    );
};

export const useCsrf = (): CsrfContextProps => {
    const context = useContext(CsrfContext);
    if (!context) {
        throw new Error('useCsrf must be used within a CsrfProvider');
    }
    return context;
};

export default CsrfContext