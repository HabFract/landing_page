import { useState } from 'react';
import './ProductTabs.css';

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

interface ProductTabsProps {
  products: Product[];
}

export default function ProductTabs({ products }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(products[0]?.id || '');

  const activeProduct = products.find((p) => p.id === activeTab);

  return (
    <div className="product-tabs">
      <div className="product-tabs__nav">
        {products.map((product) => (
          <button
            key={product.id}
            className={`product-tabs__button ${
              activeTab === product.id ? 'product-tabs__button--active' : ''
            }`}
            onClick={() => setActiveTab(product.id)}
          >
            {product.name}
          </button>
        ))}
      </div>

      <div className="product-tabs__content">
        {activeProduct && (
          <div className="product-tabs__features">
            {activeProduct.features.map((feature, index) => (
              <div key={index} className="product-tabs__feature">
                <span className="product-tabs__feature-icon">{feature.icon}</span>
                <div className="product-tabs__feature-content">
                  <h3 className="product-tabs__feature-title">{feature.title} →</h3>
                  <p className="product-tabs__feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
