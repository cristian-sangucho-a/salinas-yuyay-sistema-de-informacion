import React from 'react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
            <footer className="fixed bottom-4 right-4">
                <p className="text-xs text-[#4A3B31]/50 italic">
                    Desarrollado por Hakan Team
                </p>
            </footer>
        </div>
    );
};

export default AdminLayout;