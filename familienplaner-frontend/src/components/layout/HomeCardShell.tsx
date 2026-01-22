import React from "react";

type HomeCardShellProps = {
    children: React.ReactNode;
};

export const HomeCardShell: React.FC<HomeCardShellProps> = ({ children }) => {
    return (
        <div className="ui-container pt-6 sm:pt-8">
            <section className="ui-card p-6 sm:p-8">
                {children}
            </section>
        </div>
    );
};
