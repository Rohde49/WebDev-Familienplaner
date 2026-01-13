import React from "react";

type PageShellProps = {
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export const PageShell: React.FC<PageShellProps> = ({
    title,
    children,
    className,
}) => {
    return (
        <div className={`ui-container py-6 sm:py-8 ${className ?? ""}`}>
            <div className="space-y-6">
                {title && (
                    <header>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                    </header>
                )}

                <main>{children}</main>
            </div>
        </div>
    );
};
