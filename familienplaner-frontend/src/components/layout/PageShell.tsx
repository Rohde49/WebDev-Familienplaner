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
        <div
            className={`ui-container flex min-h-[calc(100vh-4rem)] flex-col py-6 sm:py-8 ${
                className ?? ""
            }`}
        >
            <div className="flex w-full flex-1 flex-col">
                {title && (
                    <header className="mb-6">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                    </header>
                )}

                <main className="flex w-full flex-1 flex-col">{children}</main>
            </div>
        </div>
    );
};
