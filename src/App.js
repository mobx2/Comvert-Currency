import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function getDate() {
      const controler = new AbortController();
      try {
        if (!amount) {
          setAmount(1);
        }

        setIsLoading(true);

        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
          { signal: controler.abort() }
        );

        if (!response.ok && fromCurrency === toCurrency) {
          throw new Error("Somthing went wrong");
        }

        if (Number.isNaN(amount)) {
          setAmount(1);
          throw new Error("The input must be number");
        } else {
          setErr(null);
        }

        const data = await response.json();

        if (fromCurrency === toCurrency) {
          setConverted(amount);
        } else if (data.rates && data.rates[toCurrency] !== undefined) {
          setConverted(data.rates[toCurrency]);
        } else {
          throw new Error("Select another cuuency");
        }

        setConverted(data.rates[toCurrency]);

        setErr("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setErr(err.message);
        }
      } finally {
        setIsLoading(false);
      }

      return () => {
        controler.abort();
      };
    }

    getDate();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
      <input
        value={amount}
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
        type="text"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter amount"
      />

      <div className="flex gap-4">
        <select
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={fromCurrency}
          onChange={(e) => {
            setFromCurrency(e.target.value);
          }}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
        </select>

        <select
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={toCurrency}
          onChange={(e) => {
            setToCurrency(e.target.value);
          }}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
        </select>
      </div>

      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-gray-800">
          {isLoading
            ? `Loading`
            : err
            ? `${err}`
            : converted
            ? `${converted} ${toCurrency}`
            : ""}
        </p>
      </div>
    </div>
  );
}

export default App;
