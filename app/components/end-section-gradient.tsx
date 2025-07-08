import React from 'react';

export default function EndSectionGradient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <section
        className="h-[100vh] relative flex pt-[200px] px-8 text-white bg-gradient-custom-bottom">
            {children}
        </section>
    );
}

