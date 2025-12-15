import { useState } from "react";
import axios from "axios";
import worldMap from "./assets/world_map.png";
import "./App.css";

function App() {
    /* -------------------- STATE -------------------- */
    const [countries, setCountries] = useState([]);
    const [showButton, setShowButton] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [countryDetail, setCountryDetail] = useState(null);
    const [error, setError] = useState("");

    /* -------------------- HELPERS -------------------- */
    function getRegionColor(region) {
        switch (region) {
            case "Africa":
                return "blue";
            case "Americas":
                return "green";
            case "Asia":
                return "red";
            case "Europe":
                return "yellow";
            case "Oceania":
                return "purple";
            default:
                return "grey";
        }
    }

    function populationToMillions(population) {
        return Math.round(population / 1_000_000);
    }

    /* -------------------- OPDRACHT 1 -------------------- */
    async function fetchAllCountries() {
        try {
            const response = await axios.get(
                "https://restcountries.com/v3.1/all?fields=name,population,flags,region"
            );

            const sortedCountries = response.data.sort(
                (a, b) => a.population - b.population
            );

            setCountries(sortedCountries);
            setShowButton(false);
        } catch (e) {
            console.error(e);
        }
    }

    /* -------------------- OPDRACHT 2 -------------------- */
    async function fetchCountryByName() {
        if (!searchInput.trim()) return;

        try {
            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${searchInput}?fullText=true`
            );

            setCountryDetail(response.data[0]);
            setError("");
            setSearchInput("");
        } catch (e) {
            setCountryDetail(null);
            setError(`${searchInput} bestaat niet. Probeer het opnieuw.`);
            setSearchInput("");
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            fetchCountryByName();
        }
    }

    /* -------------------- JSX -------------------- */
    return (
        <div className="app">
            <img src={worldMap} alt="World map" className="world-map" />

            {/* ---------- OPDRACHT 1 ---------- */}
            {showButton && (
                <button onClick={fetchAllCountries}>
                    Load all countries
                </button>
            )}

            <ul className="country-list">
                {countries.map((country) => (
                    <li key={country.name.common} className="country-item">
                        <img
                            src={country.flags.png}
                            alt={`Flag of ${country.name.common}`}
                            className="flag"
                        />
                        <h3 className={getRegionColor(country.region)}>
                            {country.name.common}
                        </h3>
                        <p>Has a population of {country.population} people</p>
                    </li>
                ))}
            </ul>

            <hr />

            {/* ---------- OPDRACHT 2 ---------- */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search for a country"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={fetchCountryByName}>Zoek</button>
            </div>

            {error && <p className="error">{error}</p>}

            {countryDetail && (
                <div className="country-detail">
                    <div className="header">
                        <img
                            src={countryDetail.flags.png}
                            alt={countryDetail.name.common}
                            className="flag-large"
                        />
                        <h2>{countryDetail.name.common}</h2>
                    </div>

                    <p>
                        {countryDetail.name.common} is situated in{" "}
                        {countryDetail.subregion} and the capital is{" "}
                        {countryDetail.capital?.[0]}
                    </p>

                    <p>
                        It has a population of{" "}
                        {populationToMillions(countryDetail.population)} million people and
                        it borders with {countryDetail.borders?.length || 0} neighboring
                        countries
                    </p>

                    <p>
                        Websites can be found on{" "}
                        {countryDetail.tld?.join(", ")} domain's
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
