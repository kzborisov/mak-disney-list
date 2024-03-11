import { getDatabase, onValue, ref } from "firebase/database";
import { app, writeMovieData, writeNextMovie } from "./firebase";
import React, { useState } from "react";
import { DotLoader } from "react-spinners";

import MovieCard from "./components/MovieCard.jsx";
import Button from "./components/Button.jsx";
import Modal from "./components/Modal.jsx";
import { FaArrowUp } from "react-icons/fa";

function App() {
  const db = getDatabase(app);
  const [movies, setMovies] = useState([]);
  const [sortByYear, setSortByYear] = useState("asc");
  const [sortByName, setSortByName] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});
  const [nextMovie, setNextMovie] = useState({});
  const [isHidden, setIsHidden] = useState(true);

  const watchedMoviesCount = movies.filter((m) => m.watched).length;

  useState(() => {
    onValue(
      ref(db, "/movies"),
      (snapshot) => setMovies(Object.values(snapshot.val())),
      {
        onlyOnce: true,
      }
    );

    onValue(ref(db, "/nextMovie"), (snapshot) => setNextMovie(snapshot.val()), {
      onlyOnce: true,
    });
  }, []);

  useState(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    });
  }, []);

  const handleCardClick = (movie) => {
    setShowModal(true);
    setCurrentMovie(movie);
  };

  const handleSortByYear = () => {
    setSortByYear((prev) => (prev === "asc" ? "desc" : "asc"));
    const sortedMovies = movies.sort((a, b) =>
      sortByYear === "asc" ? b.year - a.year : a.year - b.year
    );

    setMovies(sortedMovies);
  };

  const handleSortByName = () => {
    setSortByName((prev) => (prev === "asc" ? "desc" : "asc"));
    const sortedMovies = movies.sort((a, b) =>
      sortByName === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );
    setMovies(sortedMovies);
  };

  const handleNextMovieClick = () => {
    setNextMovie(currentMovie);
    writeNextMovie(currentMovie);
    setShowModal(false);
  };

  const handleWatchedMovie = (e, movie) => {
    const watched = Boolean(e.target.value === "yes");

    writeMovieData(
      movie.title,
      movie.title,
      movie.year,
      movie.image_url,
      watched
    );
    const updatedMovies = movies.map((m) =>
      m.title === movie.title ? { ...m, watched } : m
    );
    setMovies(updatedMovies);
    setShowModal(false);
  };

  const handleOnChangeFiltering = (e) => {
    const searchPattern = e.target.value;
    const filtered = movies.filter((m) =>
      m.title.toLowerCase().includes(searchPattern.toLowerCase())
    );
    setMovies(filtered);
    if (searchPattern === "") {
      onValue(
        ref(db, "/movies"),
        (snapshot) => setMovies(Object.values(snapshot.val())),
        {
          onlyOnce: true,
        }
      );
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <h1 className='text-center my-12 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
          MAK{" "}
        </span>
        <span className='text-transparent bg-clip-text bg-gradient-to-l to-emerald-600 from-sky-400'>
          Movies{" "}
        </span>
        <span className='text-transparent bg-clip-text bg-gradient-to-l to-emerald-600 from-sky-400'>
          List{" "}
        </span>
      </h1>

      <section id='content' className='mx-5 md:mx-20'>
        <div className='flex flex-col items-center justify-center'>
          <h4 className='text-center text-lg font-semibold text-gray-500 mb-2'>
            Next:{" "}
            <span
              onClick={(e) => {
                handleCardClick(
                  movies.find((m) => m.title === e.target.textContent)
                );
              }}
              className='text-transparent cursor-pointer bg-clip-text font-extrabold bg-gradient-to-l to-emerald-600 from-sky-400'
            >
              {nextMovie?.title}
            </span>
          </h4>
          <div className='flex gap-4'>
            <span className='text-sm font-semibold text-gray-500'>
              Watched Movies:{" "}
              <span className='font-bold'>{watchedMoviesCount}</span>
            </span>

            <span className='text-sm font-semibold text-gray-500'>
              Movies To Watch:{" "}
              <span className='font-bold'>
                {movies.filter((m) => !m.watched).length}
              </span>
            </span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center mt-4 mb-10'>
          <p className='text-center text-sm text-gray-700 m-2'>Sort By</p>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-evenly'>
              <Button
                handleClick={handleSortByYear}
                sortBy={sortByYear}
                title='Year'
              />
              <Button
                handleClick={handleSortByName}
                sortBy={sortByName}
                title='Name'
              />
            </div>
            <input
              type='text'
              className='p-2 border-2 rounded-xl'
              onChange={handleOnChangeFiltering}
            />
          </div>
        </div>
        {movies.length !== 0 ? (
          <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
            {movies
              .sort((m) => m.watched)
              .map((movie) => (
                <React.Fragment key={movie.title}>
                  <MovieCard
                    title={movie.title}
                    year={movie.year}
                    watched={movie.watched}
                    imgUrl={movie.image_url}
                    handleClick={() => handleCardClick(movie)}
                  />
                </React.Fragment>
              ))}
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <DotLoader
              color={"rgba(56,189,248, 0.4)"}
              size={150}
              aria-label='Loading Spinner'
              data-testid='loader'
            />
          </div>
        )}
      </section>

      {showModal && (
        <Modal
          movie={currentMovie}
          handleCloseModal={() => setShowModal((prev) => !prev)}
          handleNextMovie={handleNextMovieClick}
          handleWatchedMovie={handleWatchedMovie}
        />
      )}

      <button
        className={`p-5 m-5 cursor-pointer bg-gradient-to-l to-emerald-600 from-sky-400 rounded-full text-white sticky left-[85%] md:left-[95%] bottom-10 ${
          isHidden ? "hidden" : ""
        }`}
        onClick={handleScrollToTop}
      >
        <FaArrowUp size={32} />
      </button>
    </>
  );
}

export default App;
