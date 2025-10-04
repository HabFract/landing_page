import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleItem(index);
    }
  };

  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="faq-accordion__item">
            <button
              className="faq-accordion__question"
              onClick={() => toggleItem(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              type="button"
            >
              <span className="faq-accordion__question-text">{item.question}</span>
              <span className={`faq-accordion__icon ${isOpen ? 'faq-accordion__icon--open' : ''}`}>
                ▼
              </span>
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`faq-accordion__answer ${isOpen ? 'faq-accordion__answer--open' : ''}`}
              role="region"
              aria-hidden={!isOpen}
            >
              <div className="faq-accordion__answer-content">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
