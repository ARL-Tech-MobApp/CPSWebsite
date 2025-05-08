import React, { useState, useEffect } from 'react';
import quotes from './quotes.json';

interface Quote {
  text: string;
  author: string;
}

const RandomQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Generate a random index based on current time and quote count
    const now = new Date();
    const timeSeed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const quoteCount = quotes.length;
    const randomIndex = (timeSeed % quoteCount);
    
    setQuote(quotes[randomIndex]);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="quoteLoading d-flex justify-content-center align-items-center py-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="quoteError alert alert-warning text-center mb-0">
        <i className="bi bi-exclamation-circle-fill me-2"></i>
        No quotes available
      </div>
    );
  }

  return (
    <div className="random-quote bg-light p-4 mb-4 rounded">
      <figure className="mb-0">
        <blockquote className="blockquote">
          <p className="mb-0 fs-5">"{quote.text}"</p>
        </blockquote>
        <figcaption className="blockquote-footer mt-2 text-end">
          <cite title={quote.author}>{quote.author}</cite>
        </figcaption>
      </figure>
    </div>
  );
};

export default RandomQuote;