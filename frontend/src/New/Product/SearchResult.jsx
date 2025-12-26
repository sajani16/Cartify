import { useSearchParams } from "react-router-dom";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/product/search?keyword=${keyword}`
        );
        if (res.data.success) {
          setProducts(res.data.products);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchResult();
  }, [keyword]);
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Search results for "{keyword}"</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4">
              <img src={p.image} alt={p.name} />
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResult;
