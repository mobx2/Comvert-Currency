import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmout] = useState(1);
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currErr, setCurrErr] = useState(false);

  if (!amount) {
    setAmout(1);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function getCurr() {
      if (from === to) {
        setCurrErr("Please change currency");
        setConverted("");
      }

      try {
        setIsLoading(true);

        setCurrErr(false);
        const respone = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
          { signal: controller.signal }
        );

        const data = await respone.json();

        setConverted(data.rates[to]);
        console.log(converted);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.log(err);
        setCurrErr(err.message);
        setConverted("");
      } finally {
        setIsLoading(false);
      }
    }

    getCurr();

    return () => {
      controller.abort();
    };
  }, [to, from, amount]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
      <input
        value={amount}
        type="number"
        onChange={(e) => setAmout(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter amount"
      />

      <div className="flex gap-4">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
        </select>

        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
        </select>
      </div>

      <div className="text-center mt-4">
        <p className="text-lg font-semibold text-gray-800">
          {isLoading
            ? "⏳ Loading..."
            : currErr
            ? `⚠️ ${currErr}`
            : converted !== null
            ? `${converted} ${to}`
            : "Enter Amount"}
        </p>
      </div>
    </div>
  );
}

export default App;
