import React from "react";

type RecipeBookShellProps = {
    title: string;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
};

export const RecipeBookShell: React.FC<RecipeBookShellProps> = ({
                                                                    title,
                                                                    description,
                                                                    actions,
                                                                    children,
                                                                }) => {
    return (
        <div
            className="
                mx-auto w-full max-w-6xl
                px-4 sm:px-6
                py-6 sm:py-10
            "
        >
            <section
                className="
                    relative
                    rounded-3xl
                    border border-border
                    bg-card text-card-foreground
                    shadow-sm
                "
            >
                {/* Header */}
                <header
                    className="
                        px-6 sm:px-8
                        pt-6 sm:pt-8
                        pb-5
                        text-center
                        space-y-2
                    "
                >
                    <h1
                        className="
                            text-2xl sm:text-3xl
                            font-semibold tracking-tight
                            text-foreground
                        "
                    >
                        {title}
                    </h1>

                    {description && (
                        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </header>

                {/* Actions Bar */}
                {actions && (
                    <div
                        className="
                            border-t border-border/60
                            px-6 sm:px-8
                            py-4
                            bg-muted/30
                        "
                    >
                        <div
                            className="
                                flex flex-col gap-3
                                sm:flex-row sm:items-center sm:justify-between
                            "
                        >
                            {actions}
                        </div>
                    </div>
                )}

                {/* Content */}
                <main className="px-6 sm:px-8 py-6 sm:py-8">
                    {children}
                </main>
            </section>
        </div>
    );
};
