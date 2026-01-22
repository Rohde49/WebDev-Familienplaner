import React from "react";
import { ChefHat } from "lucide-react";

type RecipeFormShellProps = {
    title: string;
    subtitle?: React.ReactNode;
    tags?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
};

export const RecipeFormShell: React.FC<RecipeFormShellProps> = ({
                                                                    title,
                                                                    subtitle,
                                                                    tags,
                                                                    children,
                                                                    actions,
                                                                }) => {
    return (
        <div className="ui-container pt-6 sm:pt-8">
            <section className="ui-card p-6 sm:p-8 space-y-6">
                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>

                            {subtitle && (
                                <p className="text-sm text-muted-foreground">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border bg-muted">
                            <ChefHat className="h-5 w-5" />
                        </div>
                    </div>

                    {tags && <div className="flex flex-wrap gap-2">{tags}</div>}
                </header>

                <hr className="border-border" />

                {/* Content */}
                <div className="space-y-6">{children}</div>

                {/* Actions */}
                {actions && (
                    <>
                        <hr className="border-border" />
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            {actions}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};
