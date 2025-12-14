import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './FilmStrip.css';

// Replace with your actual image paths
// Using placeholders for now
const MARQUEE_PHOTOS = [
    `${import.meta.env.BASE_URL}IMG_9353-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9363-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9459-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9465-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9475-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9544-optimized.webp`,
    `${import.meta.env.BASE_URL}IMG_9549-optimized.webp`
];

const FilmStrip: React.FC = () => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Lightbox handlers
    const openLightbox = (index: number) => {
        setCurrentIndex(index % MARQUEE_PHOTOS.length);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => setIsLightboxOpen(false);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % MARQUEE_PHOTOS.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + MARQUEE_PHOTOS.length) % MARQUEE_PHOTOS.length);

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);
    return (
        <div className="film-strip-container">
            {/* Container that holds the sliding track */}
            <div className="film-track-container">

                {/* The Track: We map the images TWICE to ensure seamless looping */}
                <div className="film-track">
                    {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((src, idx) => (
                        <div
                            key={idx}
                            className="film-item group"
                            onClick={() => openLightbox(idx)}
                            style={{ cursor: 'pointer' }}
                        >

                            {/* Image Container */}
                            <div className="film-image-container">
                                <img
                                    src={src}
                                    alt={`Photo ${Math.floor(idx / 2) + 1} of Chhaya and Aditya`}
                                    className="film-image"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>

                            {/* Optional: Tiny "Timestamp" Overlay */}
                            <div className="film-timestamp">
                                FIG {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Caption below strip */}
            <div className="film-caption">
                <p>Breaking: Visual confirmation of the couple spotted in various sectors.</p>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="filmstrip-lightbox"
                    onClick={closeLightbox}
                >
                    <button
                        className="lightbox-close"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        ✕
                    </button>
                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        aria-label="Previous photo"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        aria-label="Next photo"
                    >
                        <ChevronRight size={32} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={MARQUEE_PHOTOS[currentIndex]}
                            alt={`Photo ${currentIndex + 1} of Chhaya and Aditya`}
                            className="lightbox-image"
                        />
                        <div className="lightbox-caption">
                            Photo {currentIndex + 1} of {MARQUEE_PHOTOS.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilmStrip;
