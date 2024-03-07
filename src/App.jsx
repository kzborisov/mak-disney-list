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
      <h1 className='text-3xl font-bold text-center px-4 py-10'>
        MAK Disney List
      </h1>

      {movies.length !== 0 ? (
        <div className='grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mx-6'>
          {movies
            .sort((a, b) => b.year - a.year)
            .sort((m) => !m.watched)
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
