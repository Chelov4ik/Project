// NewsSection.js
import React from 'react';
import NewsCard from './NewsCard';
import './NewsSection.css';

const newsItems = [
    {
        id: 1,
        title: "SALEEEE",
        image: "/News.jpg",
        text: "We have sales for u, u can buy 2 pairs of shoes and pay for 3."
    },
    {
        id: 2,
        title: "Better than aliexpress",
        image: "/News.jpg",
        text: "We are better than ali."
    },
    {
        id: 3,
        title: "Sale for programmers",
        image: "/News.jpg",
        text: "if u are a programmer, u can get a special sale, buy 1 shoes and get nothing as a present from us."
    },
];

const NewsSection = () => {
    return (
        <div className="news-section">
            {newsItems.map(news => (
                <NewsCard 
                    key={news.id} 
                    image={news.image} 
                    title={news.title} 
                    text={news.text} 
                />
            ))}
        </div>
    );
};

export default NewsSection;
