import axios from "axios";
import { useState } from "react";
import worldMap from "../assets/world-map.png";

function CountriesOverview() {
    const [countries, setCountries] = useState([]);
    const [showButton, setShowButton] = useState(true);

    async function fetchCountries() {
        const response = await axios.get(
            "https://restcountries.com/v3.1/all?fields=name,population,flags,region"
        );

        const sorted = response.data.sort(
            (a, b) => a.population - b.population
        );

        setCountries(sorted);
        setShowButton(false);
    }

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

    return (
        <div>
            <img src={worldMap} alt="World map" />

            {showButton && (
                <button onClick={fetchCountries}>
                    Load all countries
                </button>
            )}

            <ul>
                {countries.map((country) => (
                    <li key={country.name.common}>
                        <img src={country.flags.png} alt="" width="30" />
                        <span className={getRegionColor(country.region)}>
              {country.name.common}
            </span>
                        <p>
                            Has a population of {country.population} people
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CountriesOverview;
