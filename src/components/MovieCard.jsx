const MovieCard = ({ title, year, watched, imgUrl, handleClick }) => {
  return (
    <div
      className={`${
        watched ? "grayscale" : "grayscale-0"
      } flex flex-col justify-space items-center gap-4 hover:scale-110 transition-all ease-in duration-100 cursor-pointer`}
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
