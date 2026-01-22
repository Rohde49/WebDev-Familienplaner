import React from "react";
import { User } from "lucide-react";

type ProfileCardShellProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

export const ProfileCardShell: React.FC<ProfileCardShellProps> = ({
                                                                      title,
                                                                      description,
                                                                      children,
                                                                  }) => {
    return (
        <div className="ui-container pt-6 sm:pt-8">
            <section className="ui-card p-6 sm:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <User className="h-7 w-7 text-primary" />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {/* Content */}
                {children}
            </section>
        </div>
    );
};
