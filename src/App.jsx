import { getDatabase, onValue, ref } from "firebase/database";
import { app, writeMovieData } from "./firebase";
import React, { useState } from "react";

import MovieCard from "./components/MovieCard.jsx";
import { DotLoader } from "react-spinners";

function App() {
  const db = getDatabase(app);
  const [movies, setMovies] = useState([]);

  useState(() => {
    onValue(
      ref(db, "/movies"),
      (snapshot) => setMovies(Object.values(snapshot.val())),
      {
        onlyOnce: true,
      }
    );
  }, []);

  const handleClick = (movie) => {
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

  return (
    <>
      <h1 className='text-center mx-6 my-12 text-3xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400'>
          MAK{" "}
        </span>
        <span className='text-transparent bg-clip-text bg-gradient-to-l to-emerald-600 from-sky-400'>
          Disney{" "}
        </span>
        <span className='text-transparent bg-clip-text bg-gradient-to-l to-emerald-600 from-sky-400'>
          List{" "}
        </span>
      </h1>

      {movies.length !== 0 ? (
        <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mx-6'>
          {movies
            .sort((a, b) => b.year - a.year)
            .sort((m) => m.watched)
            .map((movie) => (
              <React.Fragment key={movie.title}>
                <MovieCard
                  title={movie.title}
                  year={movie.year}
                  watched={movie.watched}
                  imgUrl={movie.image_url}
                  handleClick={() => handleClick(movie)}
                />
              </React.Fragment>
            ))}
        </div>
      ) : (
        <div className='flex items-center justify-center'>
          <DotLoader
            color={"#ff3323"}
            size={150}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      )}
    </>
  );
}

export default App;
