import React from "react";

type CenteredCardShellProps = {
    children: React.ReactNode;
    className?: string;
};

export const CenteredCardShell: React.FC<CenteredCardShellProps> = ({
                                                                        children,
                                                                        className,
                                                                    }) => {
    return (
        <div
            className={[
                // volle Breite, kein ui-container
                "flex w-full justify-center",
                // kleiner, kontrollierter Abstand zur NavBar
                "pt-4 sm:pt-6",
                // horizontaler Sicherheitsabstand
                "px-4 sm:px-6",
                className ?? "",
            ].join(" ")}
        >
            {/*
              KEIN min-h, KEIN flex-1 →
              Card bestimmt ihre Höhe selbst
            */}
            {children}
        </div>
    );
};
