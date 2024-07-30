import React from 'react';
import './NewsSection.css';

const NewsCard = ({ image, title, text }) => {
    return (
        <div className="news-card">
            <img src={image} alt={title} className="news-image" />
            <h2 className="news-title">{title}</h2>
            <p className="news-text">{text}</p>
        </div>
    );
};

export default NewsCard;
