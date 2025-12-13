import React from 'react';
import './FilmStrip.css';

// Replace with your actual image paths
// Using placeholders for now
const MARQUEE_PHOTOS = [
    "/IMG_9353.jpeg",
    "/IMG_9363.jpeg",
    "/IMG_9459.jpeg",
    "/IMG_9465.jpeg",
    "/IMG_9475.jpeg",
    "/IMG_9544.jpeg",
    "/IMG_9549.jpeg"
];

const FilmStrip: React.FC = () => {
    return (
        <div className="film-strip-container">
            {/* Container that holds the sliding track */}
            <div className="film-track-container">

                {/* The Track: We map the images TWICE to ensure seamless looping */}
                <div className="film-track">
                    {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((src, idx) => (
                        <div key={idx} className="film-item group">

                            {/* Image Container */}
                            <div className="film-image-container">
                                <img
                                    src={src}
                                    alt={`Evidence ${idx}`}
                                    className="film-image"
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
        </div>
    );
};

export default FilmStrip;
