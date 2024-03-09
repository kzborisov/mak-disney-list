import { getDatabase, onValue, ref } from "firebase/database";
import { app, writeMovieData, writeNextMovie } from "./firebase";
import React, { useState } from "react";
import { DotLoader } from "react-spinners";

import MovieCard from "./components/MovieCard.jsx";
import Button from "./components/Button.jsx";
import Modal from "./components/Modal.jsx";

function App() {
  const db = getDatabase(app);
  const [movies, setMovies] = useState([]);
  const [sortByYear, setSortByYear] = useState("asc");
  const [sortByName, setSortByName] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});
  const [nextMovie, setNextMovie] = useState({});

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

  const handleCardClick = (movie) => {
    setShowModal(true);
    setCurrentMovie(movie);
    // let msg;
    // if (movie.watched) {
    //   msg = `Do you want to mark ${movie.title} as not watched?`;
    // } else {
    //   msg = `Have you watched ${movie.title}?`;
    // }
    // if (!confirm(msg)) {
    //   return;
    // }
    // writeMovieData(
    //   movie.title,
    //   movie.title,
    //   movie.year,
    //   movie.image_url,
    //   !movie.watched
    // );
    // const updatedMovies = movies.map((m) =>
    //   m.title === movie.title ? { ...m, watched: !m.watched } : m
    // );
    // setMovies(updatedMovies);
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
  };

  const handleWatchedMovie = (e, movie) => {
    let watched;
    const btnText = e.target.textContent.trim();
    if (btnText === "Yes") {
      watched = true;
    } else if (btnText === "No") {
      watched = false;
    }

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
        <h4 className='text-center text-lg font-semibold text-gray-500'>
          Next Movie:{" "}
          <span className='text-transparent bg-clip-text font-extrabold bg-gradient-to-l to-emerald-600 from-sky-400'>
            {nextMovie?.title}
          </span>
        </h4>
        <div className='flex flex-col items-center justify-center gap-4 my-10'>
          <p className='text-center text-sm text-gray-700'>Sort By</p>

          <div className='flex gap-4'>
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
    </>
  );
}

export default App;
