import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Novo.css";
import Principal from "./Principal";

let arr = ["Popular", "Theatre", "Kids", "Drama", "Comedie"];

let API_KEY = "?api_key=05995eed7f3a97b0cd7a4e59fe90ad97";
let BASE_URL = "https://api.themoviedb.org/3";
let url = BASE_URL + "/movie/popular" + API_KEY;

export default function Novo() {
  const [movieData, setData] = useState([]);
  const [url_set, setUrl] = useState(url);
  const [search, setSearch] = useState();

  useEffect(() => {
    fetch(url_set)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao carregar os dados dos filmes.");
        }
        return res.json();
      })
      .then((data) => {
        setData(data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [url_set]);

  const getData = (movieType) => {
    let updatedUrl = url;
    if (movieType === "Popular") {
      updatedUrl = BASE_URL + "/movie/popular" + API_KEY;
    }
    if (movieType === "Theatre") {
      updatedUrl =
        BASE_URL +
        "/movie/now_playing" +
        API_KEY;
    }
    setUrl(updatedUrl);
  };

  const searchMovie = (evt) => {
    if (evt.key === "Enter") {
      const searchQuery = search.trim();
      if (searchQuery) {
        const searchUrl =
          BASE_URL +
          "/search/movie" +
          API_KEY +
          "&query=" +
          encodeURIComponent(searchQuery);
        setUrl(searchUrl);
      }
    }
  };

  return (
    <>
      <div className="teste">
        <div className="opcao">
          <ul className="navigation">
            <li>
              <button className="nav-button" onClick={() => getData("Popular")}>
                Popular
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => getData("Theatre")}>
                Cinema
              </button>
            </li>
          </ul>
        </div>
        <div className="search-container">
          
          <input
            type="text"
            className="search-input"
            placeholder="Procurar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={searchMovie}
          />
        </div>
        <div className="container">
          {movieData.length === 0 ? (
            <p className="notfound">Not Found</p>
          ) : (
            movieData.map((res, pos) => {
              return <Card info={res} key={pos} />;
            })
          )}
        </div>
      </div>
    </>
  );
}
