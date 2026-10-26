import React from "react";
import { lazy, Suspense } from "react";

const MotionDiv = lazy(() =>
    import("motion/react").then((m) => ({
        default: m.motion.div
    }))
);

export default function MotionWrapper({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={null}>
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {children}
            </MotionDiv>
        </Suspense>
    );
}