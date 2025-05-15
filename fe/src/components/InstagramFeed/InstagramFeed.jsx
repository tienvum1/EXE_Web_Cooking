import React from "react";
import "./InstagramFeed.scss";
import Instagram from "../../assets/images/instagram.png";

export default function InstagramFeed() {
  return (
    <section className="instagram">
      <h2 className="instagram__title">
        Check out <span>@fitmeal</span> on Instagram
      </h2>
      <p className="instagram__subtitle">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua enim ad minim.
      </p>

      <div className="instagram__gallery">
        {Array(4)
          .fill()
          .map((_, i) => (
            <img
              key={i}
              src={Instagram}
              alt={`Instagram ${i + 1}`}
              className="instagram__image"
            />
          ))}
      </div>

      <button className="instagram__button">
        Visit Our Instagram
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
        >
          <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5zm4.25 3a.88.88 0 110 1.76.88.88 0 010-1.76zM12 7.5a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5z" />
        </svg>
      </button>
    </section>
  );
}
