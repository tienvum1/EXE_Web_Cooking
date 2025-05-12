import React from 'react';
import './ChefQuote.scss';

const ChefQuote = () => (
  <section className="chef-quote">
    <div className="chef-quote__text">
      <h2>
        Everyone can become a wellness chef,<br />
        creating nutritious and healthy meals<br />
        in their own home kitchen.
      </h2>
      <p>
        Fuel your body with wholesome ingredients, embrace a balanced lifestyle, and make every meal a step toward better health!
      </p>
      <button>Learn More</button>
    </div>
    <div className="chef-quote__img">
      <img src="https://pngimg.com/d/chef_PNG186.png" alt="Chef" />
    </div>
  </section>
);

export default ChefQuote; 