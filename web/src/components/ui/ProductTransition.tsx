'use client';
import { useState } from 'react';
import { TransitionPanel } from './TransitionPanel';
import './ProductTransition.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Product {
  id: string;
  name: string;
  features: Feature[];
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
        {products.map((product) => (
          <div key={product.id} className="product-transition__features">
            {product.features.map((feature, idx) => (
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
        ))}
      </TransitionPanel>
    </div>
  );
}
