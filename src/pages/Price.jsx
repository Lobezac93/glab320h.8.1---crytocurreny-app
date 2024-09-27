import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Price() {
  // Our API key from coinapi.io.
  const apiKey = import.meta.env.VITE_API_KEY;
  console.log("API Key:", apiKey);

  // Grabbing the currency symbol from the URL Params.
  const { symbol } = useParams();

  // State to hold the coin data.
  const [coin, setCoin] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch coin data.
  const getCoin = async () => {
    try {
      const url = `https://rest.coinapi.io/v1/exchangerate/${symbol}/USD?apikey=${apiKey}`;
      const response = await fetch(url);

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setCoin(data);
    } catch (e) {
      console.error("Error fetching coin data:", e);
      setError(e.message);
    }
  };

  // useEffect to run getCoin when component mounts or symbol/apiKey changes.
  useEffect(() => {
    if (symbol && apiKey) {
      getCoin();
    }
  }, [symbol, apiKey]); // Include apiKey as a dependency

  // Loaded function for when data is fetched.
  const loaded = () => {
    return (
      <div>
        <h1>
          {coin.asset_id_base}/{coin.asset_id_quote}
        </h1>
        <h2>{coin.rate}</h2>
      </div>
    );
  };

  // Function for when data doesn't exist.
  const loading = () => {
    return <h1>Loading...</h1>;
  };

  // Error display if fetching fails
  const errorMessage = () => {
    return <h1>Error: {error}</h1>;
  };

  // If there's an error, display the error message.
  if (error) return errorMessage();

  // If coin has data, run the loaded function; otherwise, run loading.
  return coin && coin.rate ? loaded() : loading();
}


