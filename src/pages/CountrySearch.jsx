import axios from "axios";
import { useState } from "react";
import globe from "../assets/globe.png";

function CountrySearch() {
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState(null);
    const [error, setError] = useState("");

    function toMillions(pop) {
        return Math.round(pop / 1_000_000);
    }

    async function searchCountry() {
        try {
            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${search}?fullText=true`
            );

            setCountry(response.data[0]);
            setError("");
            setSearch("");
        } catch {
            setCountry(null);
            setError(`${search} bestaat niet. Probeer het opnieuw.`);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            searchCountry();
        }
    }

    return (
        <div className="app">
            <h1>Search country information</h1>

            <img src={globe} alt="Globe" className="globe" />

            <div className="search">
                <input
                    placeholder="Bijvoorbeeld Nederland of Peru"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={searchCountry}>ZOEK</button>
            </div>

            {error && <p className="error">{error}</p>}

            {country && (
                <div className="card">
                    <h2>{country.name.common}</h2>
                    <p>
                        {country.name.common} is situated in{" "}
                        {country.subregion} and the capital is{" "}
                        {country.capital?.[0]}
                    </p>
                    <p>
                        It has a population of {toMillions(country.population)} million
                        people and it borders with{" "}
                        {country.borders?.length || 0} neighboring countries
                    </p>
                    <p>
                        Websites can be found on {country.tld?.join(", ")} domain&apos;s
                    </p>
                </div>
            )}
        </div>
    );
}

export default CountrySearch;
