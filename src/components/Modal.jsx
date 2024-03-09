import { IoIosClose } from "react-icons/io";
import Button from "./Button";

const Modal = ({
  movie,
  handleCloseModal,
  handleNextMovie,
  handleWatchedMovie,
}) => {
  return (
    <div
      id='modal'
      className='overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-screen md:inset-0 h-screen max-h-screen bg-blackTransparent flex items-center justify-center'
    >
      <div
        id='content'
        className='flex flex-col gap-2 justify-center bg-slate-50 py-5 px-10 w-2/3 md:w-1/3'
      >
        <div className='flex w-full justify-end'>
          <IoIosClose
            size={42}
            onClick={handleCloseModal}
            className='cursor-pointer'
          />
        </div>
        <div className='flex flex-col items-center justify-between gap-4'>
          <h3 className='text-xl text-center md:text-3xl font-semibold text-gray-500'>
            {movie.title} ({movie.year})
          </h3>
          <img src={movie.image_url} alt={movie.title} />

          <div className='flex flex-col items-center justify-center gap-2'>
            <p className='text-center text-md font-medium text-gray-500'>
              Watched?
            </p>
            <div className='flex justify-between gap-2'>
              <Button
                handleClick={(e) => handleWatchedMovie(e, movie)}
                title='Yes'
              />
              <Button
                handleClick={(e) => handleWatchedMovie(e, movie)}
                title='No'
              />
            </div>
            <Button handleClick={handleNextMovie} title='Watch next?' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
