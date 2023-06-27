import React, { useEffect, useState, useContext } from "react";
import { app } from "../services/FirebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "./Carousel.css";
import UserContext from "../contexts/UserContext";
let API_KEY = "?api_key=05995eed7f3a97b0cd7a4e59fe90ad97";
let BASE_URL = "https://api.themoviedb.org/3";
let url = BASE_URL + "/movie/popular" + API_KEY;
let img_path = "https://image.tmdb.org/t/p/w500";

const App = (movie) => {
  const { userId } = useContext(UserContext);
  const [filmes, setFilmes] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchedMovieName, setWatchedMovieName] = useState("");
  const [watchedMovieRating, setWatchedMovieRating] = useState("");
  const [watchlistMovieName, setWatchlistMovieName] = useState("");
  const [streamingPlatform, setStreamingPlatform] = useState("");

  const db = getFirestore(app);
  const filmesCollection = collection(db, "filmes");

  useEffect(() => {
    const getFilmes = async () => {
      if (!userId) {
        setFilmes([]);
        setWatchedMovies([]);
        setWatchlistMovies([]);
        return;
      }

      const q = query(filmesCollection, where("userId", "==", userId));

      try {
        const data = await getDocs(q);
        const allFilmes = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const watchedFilmes = allFilmes.filter(
          (filme) => filme.type === "watched"
        );
        const watchlistFilmes = allFilmes.filter(
          (filme) => filme.type === "watchlist"
        );

        setFilmes(allFilmes);
        setWatchedMovies(watchedFilmes);
        setWatchlistMovies(watchlistFilmes);
      } catch (error) {
        console.error("Erro ao obter filmes: ", error);
      }
    };

    getFilmes();
  }, [userId]);

  const handleAddWatchedMovie = async () => {
    if (watchedMovieName.trim() === "" || watchedMovieRating.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newMovie = {
      name: watchedMovieName,
      rating: watchedMovieRating,
      userId: userId,
      type: "watched",
    };

    try {
      await addDoc(filmesCollection, newMovie);
      setWatchedMovies((prevMovies) => [...prevMovies, { ...newMovie }]);
      setWatchedMovieName("");
      setWatchedMovieRating("");
      alert("Filme assistido adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar filme assistido: ", error);
    }
  };

  const handleDeleteWatchedMovie = async (id) => {
    try {
      await deleteDoc(doc(db, "filmes", id));
      setWatchedMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== id)
      );
      alert("Filme assistido excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir filme assistido: ", error);
    }
  };

  const handleAddWatchlistMovie = async () => {
    if (watchlistMovieName.trim() === "" || streamingPlatform.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newMovie = {
      name: watchlistMovieName,
      streamingPlatform,
      userId: userId,
      type: "watchlist",
    };

    try {
      await addDoc(filmesCollection, newMovie);
      setWatchlistMovies((prevMovies) => [...prevMovies, { ...newMovie }]);
      setWatchlistMovieName("");
      setStreamingPlatform("");
      alert("Filme para assistir adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar filme para assistir: ", error);
    }
  };

  const handleDeleteWatchlistMovie = async (id) => {
    try {
      await deleteDoc(doc(db, "filmes", id));
      setWatchlistMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== id)
      );
      alert("Filme para assistir excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir filme para assistir: ", error);
    }
  };

  const streamingPlatforms = [
    "Netflix",
    "Amazon Prime Video",
    "Disney+",
    "HBO Max",
    "Hulu",
    "Apple TV+",
    "YouTube Premium",
  ];

  return (
    <div className="container">
      <div className="inputs-container">
        <h2>Filmes Assistidos</h2>
        <input
          type="text"
          placeholder="Nome do filme"
          value={watchedMovieName}
          onChange={(e) => setWatchedMovieName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nota do filme"
          value={watchedMovieRating}
          onChange={(e) => setWatchedMovieRating(e.target.value)}
        />
        <button className="verde" onClick={handleAddWatchedMovie}>Adicionar</button>

      </div>
      <div className="movies-container">
        <h2>Filmes Assistidos</h2>
        {watchedMovies.map((movie) => (
          <div className="movie filmes" key={movie.id}>
            <span>{movie.name}</span>
            <span className="rating">Nota: {movie.rating}</span>
            <button  onClick={() => handleDeleteWatchedMovie(movie.id)}>
              Excluir
            </button>
          </div>
        ))}
      </div>
      <div className="inputs-container">
        <h2>Filmes para Assistir</h2>
        <input
          type="text"
          placeholder="Nome do filme"
          value={watchlistMovieName}
          onChange={(e) => setWatchlistMovieName(e.target.value)}
        />
        <select
          value={streamingPlatform}
          onChange={(e) => setStreamingPlatform(e.target.value)}
        >
          <option value="">Selecione a plataforma</option>
          {streamingPlatforms.map((platform, index) => (
            <option key={index} value={platform}>
              {platform}
            </option>
          ))}
        </select>
        <button className="verde" onClick={handleAddWatchlistMovie}>Adicionar</button>
      </div>
      <div className="movies-container">
        <h2>Filmes para Assistir</h2>
        {watchlistMovies.map((movie) => (
          <div className="movie filmes" key={movie.id}>
            <span>{movie.name}</span>
            <span className="platforms">Plataforma: {movie.streamingPlatform}</span>
            <button onClick={() => handleDeleteWatchlistMovie(movie.id)}>
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
