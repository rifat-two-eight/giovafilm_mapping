"use client";

import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Button } from "@/components/ui/button";

interface Category {
  _id: string;
  icon: string;
  name: string;
  color: string;
  status: "Active" | "Hidden" | string;
}

export function CategoryTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: response, isLoading } = useGetCategoriesQuery({ page, limit });
  const categories: Category[] = response?.data || [];
  const meta = response?.meta;

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const categoryTableHeaders = [
    "Icon",
    "Category Name",
    "Color",
    "Status",
    "Actions",
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {categoryTableHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category._id}
                  className={`${
                    index !== categories.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-gray-50 transition-colors`}
                >
                  {/* Icon */}
                  <td className="px-6 py-4 text-xl">{category.icon}</td>

                  {/* Category Name */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>

                  {/* Color */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />

                      <span>{category.color}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        category.status,
                      )}`}
                    >
                      {category.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Edit category"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                        aria-label={
                          category.status === "Active"
                            ? "Hide category"
                            : "Show category"
                        }
                      >
                        {category.status === "Active" ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>

                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && meta && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // Reset to first page when limit changes
              }}
              className="border border-gray-300 rounded p-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 border-none">
              Page {meta.page} of {meta.totalPage || 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (meta.totalPage || 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
