import { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

function App() {
  const [quote, setQuote] = useState({
    quoteText: null,
    quoteAuthor: null,
    color: "#333",
  });

  async function getQuotes() {
    try {
      const response = await axios.get(
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json",
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const quotesData = response.data;
      return quotesData;
    } catch (error) {
      console.error("Error fetching quotes:", error);
      throw error;
    }
  }

  const handleQuote = async () => {
    try {
      const res = await getQuotes();
      if (res && res.quotes) {
        const randomQuote =
          res.quotes[Math.floor(Math.random() * res.quotes.length)];

        const newColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        setQuote({
          quoteText: randomQuote.quote,
          quoteAuthor: randomQuote.author,
          color: newColor,
        });
        document.body.style.backgroundColor = newColor;

        const quoteBox = document.getElementById('quote-box');
        quoteBox.style.transition = 'opacity 0.5s ease-in-out';
        quoteBox.style.opacity = '0.5';

        setTimeout(() => {
          quoteBox.style.opacity = '1';
        }, 500);
      }
    } catch (error) {
      console.error("Error in handleQuote:", error);
    }
  };

  useEffect(() => {
    handleQuote();
  }, []);

  const getTweetUrl = () => {
    const hashtags = "quotes";
    const related = "freecodecamp";
    const encodedQuote = encodeURIComponent(
      `"${quote.quoteText}" ${quote.quoteAuthor}`
    );
    return `https://twitter.com/intent/tweet?hashtags=${hashtags}&related=${related}&text=${encodedQuote}`;
  };

  const getTumblrUrl = () => {
    const tags = "quotes,freecodecamp";
    const caption = encodeURIComponent(quote.quoteAuthor);
    const content = encodeURIComponent(quote.quoteText);
    const canonicalUrl = encodeURIComponent("https://www.tumblr.com/buttons");
    return `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=${tags}&caption=${caption}&content=${content}&canonicalUrl=${canonicalUrl}&shareSource=tumblr_share_button`;
  };
  return (
    <div id="quote-box" style={{ color: quote.color }}>
      <div className="quote-text">
        <i className="fas fa-quote-left"></i>
        <span id="text">{quote.quoteText}</span>
      </div>
      <div className="quote-author">
        <span id="author">- {quote.quoteAuthor}</span>
      </div>
      <div className="buttons">
        <a
          className="button"
          id="tweet-quote"
          style={{ backgroundColor: quote.color }}
          title="Tweet this quote!"
          target="_top"
          href={getTweetUrl()}
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          className="button"
          id="tumblr-quote"
          style={{ backgroundColor: quote.color }}
          title="Post this quote on tumblr!"
          target="_blank"
          href={getTumblrUrl()}
        >
          <i className="fab fa-tumblr"></i>
        </a>
        <button
          className="button"
          id="new-quote"
          style={{ backgroundColor: quote.color }}
          onClick={handleQuote}
        >
          New quote
        </button>
      </div>
    </div>
  );
}

export default App;
