import { getDatabase, onValue, ref } from "firebase/database";
import { app, writeMovieData } from "./firebase";
import React, { useState } from "react";
import { DotLoader } from "react-spinners";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import MovieCard from "./components/MovieCard.jsx";
function App() {
  const db = getDatabase(app);
  const [movies, setMovies] = useState([]);
  const [sort, setSort] = useState("asc");

  useState(() => {
    onValue(
      ref(db, "/movies"),
      (snapshot) =>
        setMovies(Object.values(snapshot.val()).sort((m) => m.watched)),
      {
        onlyOnce: true,
      }
    );
  }, []);

  const handleCardClick = (movie) => {
    if (!confirm(`Have you watched ${movie.title}?`)) {
      return;
    }
    writeMovieData(
      movie.title,
      movie.title,
      movie.year,
      movie.image_url,
      !movie.watched
    );
    const updatedMovies = movies.map((m) =>
      m.title === movie.title ? { ...m, watched: !m.watched } : m
    );
    setMovies(updatedMovies);
  };

  const handleSortClick = () => {
    setSort((prev) => (prev === "asc" ? "desc" : "asc"));
    const sortedMovies = movies
      .sort((a, b) => (sort === "asc" ? b.year - a.year : a.year - b.year))
      .sort((m) => m.watched);
    setMovies(sortedMovies);
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
        <div className='flex justify-end my-10'>
          <button
            type='button'
            className='bg-gradient-to-r to-emerald-600 from-sky-400 flex items-center justify-center gap-4 p-2 rounded-xl text-white'
            onClick={handleSortClick}
          >
            Sort {sort === "asc" ? <FaArrowUp /> : <FaArrowDown />}
          </button>
        </div>
        {movies.length !== 0 ? (
          <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
            {movies.map((movie) => (
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
    </>
  );
}

export default App;
