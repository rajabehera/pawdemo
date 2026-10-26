// src/components/OptimizedImage.tsx
interface OptimizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean; // true for LCP images (hero, first visible)
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
}: OptimizedImageProps) {
    // Build srcSet for different screen densities
    const baseSrc = src.replace(/\.(webp|jpg|jpeg|png)$/, "");
    const ext = src.match(/\.(webp|jpg|jpeg|png)$/)?.[1] || "webp";

    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "low"}
            className={className}
            referrerPolicy="no-referrer"
        />
    );
}