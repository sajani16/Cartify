import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 gap-2 flex-wrap overflow-x-auto px-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded text-sm sm:text-base ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-[#D97A2B] text-white hover:bg-[#e08b3a]"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded text-sm sm:text-base ${
            page === currentPage
              ? "bg-yellow-500 text-[#5C3A21] font-bold"
              : "bg-[#fffaf5] text-[#5C3A21] border border-[#D4B996] hover:bg-[#fdf0dc]"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded text-sm sm:text-base ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-[#D97A2B] text-white hover:bg-[#e08b3a]"
        }`}
      >
        Next
      </button>
    </div>
  );
}
