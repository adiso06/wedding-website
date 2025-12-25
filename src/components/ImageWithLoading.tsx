import React, { useState, useEffect } from 'react';
import './ImageWithLoading.css';

interface ImageWithLoadingProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');

  useEffect(() => {
    if (loading === 'lazy') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' }
      );

      const imgElement = document.querySelector(`[data-src="${src}"]`);
      if (imgElement) {
        observer.observe(imgElement);
      }

      return () => observer.disconnect();
    }
  }, [src, loading]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div className={`image-container ${className}`} data-src={src}>
      {!imageLoaded && !imageError && (
        <div className="image-skeleton" aria-label="Loading image">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      {imageError && (
        <div className="image-error" role="alert">
          <span>⚠️ Image failed to load</span>
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${imageLoaded ? 'loaded' : 'loading'} ${className}`}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: imageError ? 'none' : 'block' }}
        />
      )}
    </div>
  );
};

export default ImageWithLoading;



