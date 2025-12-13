import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import './PhotoEssay.css';

// DATA SOURCE
// Using placeholders for image sources
const ARCHIVE_DATA = [
    {
        id: 1,
        src: "/A&C-113.jpg",
        date: "OCTOBER 12, 2015",
        location: "High School, Room 304",
        headline: "THE INITIAL ENCOUNTER",
        caption: "Fig 1.1: Subjects observed during an FBLA strategy session. Note the lack of eye contact, indicating early-stage nervous tension."
    },
    {
        id: 2,
        src: "/A&C-121.jpg",
        date: "MAY 20, 2018",
        location: "University Campus",
        headline: "ACADEMIC ALLIANCE",
        caption: "Fig 1.2: Despite rigorous academic demands, the partnership remained stable. Both parties graduated with satisfactory margins."
    },
    {
        id: 3,
        src: "/A&C-125.jpg",
        date: "DECEMBER 2024",
        location: "Long Island City, NY",
        headline: "THE RATIFICATION",
        caption: "Fig 1.3: Dr. Sood presents the binding agreement (ring). Ms. Arora accepts terms immediately. Bystanders report 'high emotion'."
    },
    {
        id: 4,
        src: "/A&C-133.jpg",
        date: "RECENTLY",
        location: "Undisclosed Location",
        headline: "CURRENT STATUS",
        caption: "Fig 1.4: The merger appears to be proceeding according to schedule."
    }
];

const PhotoEssay: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Navigation Logic
    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % ARCHIVE_DATA.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + ARCHIVE_DATA.length) % ARCHIVE_DATA.length);

    const currentPhoto = ARCHIVE_DATA[currentIndex];

    return (
        <section className="photo-essay-section">

            {/* Section Header */}
            <div className="essay-header">
                <div className="essay-title">
                    <h2>EXHIBIT A: THE ARCHIVES</h2>
                    <p className="essay-subtitle">
                        Documented timeline of the merger
                    </p>
                </div>
                <div className="essay-meta">
                    CASE FILE: #2025-WED<br />
                    STATUS: UNCLASSIFIED
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="essay-grid">

                {/* LEFT COL: The Image Viewer */}
                <div className="viewer-column">
                    <div className="viewer-container">

                        {/* Main Image */}
                        <div className="viewer-frame">
                            <img
                                src={currentPhoto.src}
                                alt={currentPhoto.headline}
                                className="viewer-image"
                            />
                            {/* Watermark/Credit */}
                            <div className="watermark">
                                <Camera size={12} />
                                <span>AP PHOTO / ARORA-SOOD</span>
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        <div className="pagination-controls">
                            <button onClick={handlePrev} className="nav-btn">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNext} className="nav-btn">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: The Editorial Context */}
                <div className="editorial-column">

                    {/* Metadata Block */}
                    <div className="editorial-metadata">
                        <div className="meta-row">
                            <span className="meta-label">DATE:</span>
                            <span className="meta-value">{currentPhoto.date}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">LOCATION:</span>
                            <span className="meta-value">{currentPhoto.location}</span>
                        </div>
                    </div>

                    {/* Editorial Content */}
                    <div className="editorial-content">
                        <h3 className="editorial-headline">
                            "{currentPhoto.headline}"
                        </h3>
                        <p className="editorial-caption">
                            {currentPhoto.caption}
                        </p>
                    </div>

                    {/* The "Thumb-wheel" Navigation */}
                    <div className="thumb-nav">
                        <p className="thumb-label">Jump to document:</p>
                        <div className="thumb-grid">
                            {ARCHIVE_DATA.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`thumb-btn ${idx === currentIndex ? 'active' : ''}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PhotoEssay;
