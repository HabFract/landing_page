'use client';
import { useState } from 'react';
import { TransitionPanel } from './TransitionPanel';
import YouTubeVideos from './YouTubeVideos';
import './ProductTransition.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Card {
  title: string;
  description: string;
  cta?: {
    text: string;
    url: string;
  };
  image?: string;
}

interface Video {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  features?: Feature[];
  layout?: 'default' | 'two-column' | 'scrollable';
  cards?: Card[];
  videos?: Video[];
  blogLink?: {
    text: string;
    url: string;
  };
}

interface ProductTransitionProps {
  products: Product[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

const transition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function ProductTransition({ products }: ProductTransitionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleTabClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div className="product-transition">
      <div className="product-transition__nav">
        {products.map((product, index) => (
          <button
            key={product.id}
            className={`product-transition__button ${
              activeIndex === index ? 'product-transition__button--active' : ''
            }`}
            onClick={() => handleTabClick(index)}
          >
            {product.name}
          </button>
        ))}
      </div>

      <TransitionPanel
        activeIndex={activeIndex}
        variants={variants}
        transition={transition}
        custom={direction}
        className="product-transition__content"
      >
        {products.map((product) => {
          // Two-column layout for Plan
          if (product.layout === 'two-column' && product.cards) {
            return (
              <div key={product.id} className="product-transition__two-column">
                {product.cards.map((card, idx) => (
                  <div key={idx} className="product-transition__card">
                    {card.image && (
                      <div className="product-transition__card-image">
                        <img src={card.image} alt={card.title} />
                      </div>
                    )}
                    <h3 className="product-transition__card-title">{card.title}</h3>
                    <p className="product-transition__card-description">{card.description}</p>
                    {card.cta && (
                      <a
                        href={card.cta.url}
                        className="product-transition__card-cta"
                        target={card.cta.url.startsWith('http') ? '_blank' : undefined}
                        rel={card.cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {card.cta.text} →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          // Scrollable layout for Learn
          if (product.layout === 'scrollable') {
            return (
              <div key={product.id}>
                <YouTubeVideos blogLink={product.blogLink} />
              </div>
            );
          }

          // Default feature list layout for Automate
          return (
            <div key={product.id} className="product-transition__features">
              {product.features?.map((feature, idx) => (
                <div key={idx} className="product-transition__feature">
                  <span className="product-transition__feature-icon">
                    {feature.icon.startsWith('/') ? (
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className={idx > 0 ? 'product-transition__feature-icon--scaled' : ''}
                        style={{
                          ...(feature.icon.includes('jigsaw') ? { paddingLeft: '1rem' } : {})
                        }}
                      />
                    ) : (
                      feature.icon
                    )}
                  </span>
                  <div className="product-transition__feature-content">
                    <h3 className="product-transition__feature-title">{feature.title} →</h3>
                    <p className="product-transition__feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </TransitionPanel>
    </div>
  );
}
