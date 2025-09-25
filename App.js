import React, { useState } from "react";

const TOTAL_NUMBERS = 100;
const PRICE_PER_NUMBER = 10;

export default function App() {
  const [selected, setSelected] = useState([]);

  const toggleNumber = (num) => {
    setSelected((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const checkout = async () => {
    const resp = await fetch("https://SEU-BACKEND.onrender.com/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numbers: selected, unit_price: PRICE_PER_NUMBER }),
    });
    const data = await resp.json();
    window.location.href = data.url;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rifa Online</h1>
      <div className="grid grid-cols-10 gap-2 mb-4">
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => toggleNumber(num)}
            className={`p-2 rounded ${
              selected.includes(num) ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <button
        onClick={checkout}
        disabled={selected.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Pagar R$ {selected.length * PRICE_PER_NUMBER},00
      </button>
    </div>
  );
}