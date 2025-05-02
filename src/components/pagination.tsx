"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set("page", page.toString());
    return url.pathname + url.search;
  };

  // Calculate which pages to show
  let pages: (number | string)[] = [];

  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Show first, last, and pages around current
    pages = [1];

    if (currentPage > 3) {
      pages.push("...");
    }

    // Pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return (
    <nav className="flex justify-center mt-8 mb-4">
      <ul className="flex items-center space-x-1">
        {/* Previous Button */}
        <li>
          {currentPage > 1 ? (
            <Link href={getPageUrl(currentPage - 1)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            </Link>
          ) : (
            <button
              disabled
              className="px-3 py-2 rounded-md text-gray-400 dark:text-gray-600 cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </li>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {typeof page === "number" ? (
              <Link href={getPageUrl(page)}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-md ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </motion.button>
              </Link>
            ) : (
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li>
          {currentPage < totalPages ? (
            <Link href={getPageUrl(currentPage + 1)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </Link>
          ) : (
            <button
              disabled
              className="px-3 py-2 rounded-md text-gray-400 dark:text-gray-600 cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
