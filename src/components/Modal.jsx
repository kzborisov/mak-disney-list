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
        className='flex flex-col gap-6 justify-center bg-slate-50 py-5 px-5 md:px-10 w-[90%] md:w-[50%]'
      >
        <div className='flex w-full justify-end'>
          <IoIosClose
            size={42}
            onClick={handleCloseModal}
            className='cursor-pointer'
          />
        </div>
        <div className='flex flex-col items-center justify-center gap-6'>
          <h3 className='text-xl text-center md:text-3xl font-semibold text-gray-500'>
            {movie.title} ({movie.year})
          </h3>
          <img
            className='w-2/3 md:max-w-[350px]'
            src={movie.image_url}
            alt={movie.title}
          />

          <div className='flex flex-col items-center justify-center gap-6'>
            <div className='flex flex-col items-center justify-between gap-4'>
              <div className='flex justify-center items-center gap-2'>
                <label htmlFor='watched'>Have we watched it?</label>
                <select
                  className='rounded-xl p-2'
                  name='watched'
                  id='watched'
                  onChange={(e) => handleWatchedMovie(e, movie)}
                >
                  <option value='none' selected disabled hidden>
                    Select an Option
                  </option>
                  <option value='yes'>Yes</option>
                  <option value='no'>No</option>
                </select>
              </div>
              <Button
                handleClick={handleNextMovie}
                title='We will watch it next'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
