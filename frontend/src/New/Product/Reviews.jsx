import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// Vite environment variable
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Reviews({ productId, reviews, setReviews, token }) {
  const { id: userId } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);

  const handleSubmit = async () => {
    if (!token) return toast.error("Login required");
    if (!comment && rating === null)
      return toast.error("Provide rating or comment");

    try {
      const res = await axios.post(
        `${BASE_URL}/reviews/${productId}`,
        { comment, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReviews((prev) => {
        const filtered = prev.filter((r) => r.user._id !== userId);
        return [res.data.review, ...filtered];
      });

      setComment("");
      setRating(null);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-[#5C3A21] mb-4">
        Customer Reviews
      </h2>

      {/* Add Review */}
      {token && (
        <div className="mb-6 bg-[#fffaf5] p-4 rounded-xl shadow-sm border border-[#D4B996]">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`text-2xl transition-colors ${
                  rating !== null && rating >= s
                    ? "text-[#D97A2B]"
                    : "text-[#D4B996]"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review (optional)"
            className="w-full border border-[#D4B996] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#D97A2B] bg-[#fffdf8]"
            rows={3}
          />

          <button
            onClick={handleSubmit}
            className="mt-2 bg-[#D97A2B] text-white px-4 py-2 rounded-xl hover:bg-[#e08b3a] transition font-semibold"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-[#6B4B3A]">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r._id}
            className="border-b border-[#D4B996] py-4 last:border-b-0"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-[#5C3A21]">
                {r.user?.name || "Unknown"}
              </p>
              <p className="text-[#6B4B3A] text-sm">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-lg ${
                    r.rating !== null && r.rating >= s
                      ? "text-[#D97A2B]"
                      : "text-[#D4B996]"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {r.comment && <p className="mt-1 text-[#6B4B3A]">{r.comment}</p>}
          </div>
        ))
      )}
    </div>
  );
}
