import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const Button = ({ handleClick, title, sortBy }) => {
  return (
    <button
      type='button'
      className='bg-gradient-to-r to-emerald-600 from-sky-400 flex items-center justify-center gap-4 p-2 rounded-xl text-white'
      onClick={handleClick}
    >
      {title}{" "}
      {sortBy ? sortBy === "asc" ? <FaArrowUp /> : <FaArrowDown /> : null}
    </button>
  );
};

export default Button;
