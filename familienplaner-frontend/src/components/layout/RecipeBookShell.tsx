import React from "react";

type RecipeBookShellProps = {
    title: string;
    description?: string;
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
        <div className="ui-container py-6 sm:py-8">
            <div className="mx-auto max-w-5xl">
                <div className="ui-card p-6 sm:p-8 space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </header>

                    {/* Actions row */}
                    {actions && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {actions}
                        </div>
                    )}

                    {/* Content */}
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
};
