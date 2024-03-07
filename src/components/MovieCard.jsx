import React from "react";
import { writeMovieData } from "../firebase";

const MovieCard = ({ title, year, watched, imgUrl, handleClick }) => {
  return (
    <div
      className={`${
        watched ? "grayscale-[0.8]" : "grayscale-0"
      } flex flex-col justify-center items-center hover:scale-110 transition-all ease-in duration-100 cursor-pointer`}
      onClick={handleClick}
    >
      <img src={imgUrl} alt={title} />
      <h3 className=''>
        {title} ({year})
      </h3>
    </div>
  );
};

export default MovieCard;
