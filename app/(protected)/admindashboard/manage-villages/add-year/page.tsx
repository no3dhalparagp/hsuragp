"use client";

import { useState, useEffect } from 'react';

interface YearData {
  id: string;
  yeardata: string;
}

export default function AddYearPage() {
  const [years, setYears] = useState<YearData[]>([]);
  const [newYear, setNewYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await fetch('/api/villages/years');
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear) return;

    try {
      const response = await fetch('/api/villages/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: newYear })
      });

      if (response.ok) {
        setNewYear('');
        fetchYears(); // Refresh list
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  if (loading) return <div>Loading years...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Year Management</h1>
      
      {/* Add Year Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            placeholder="Enter year (e.g. 2023)"
            className="flex-1 px-4 py-2 border rounded-md"
            required
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Year
          </button>
        </div>
      </form>

      {/* Year List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Years</h2>
        {years.length === 0 ? (
          <p className="text-gray-500">No years found. Add your first year above.</p>
        ) : (
          <ul className="divide-y">
            {years.map((year) => (
              <li key={year.id} className="py-2 flex justify-between items-center">
                <span className="text-lg">{year.yeardata}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
