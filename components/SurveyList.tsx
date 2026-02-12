"use client";

import {
  flexRender,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import SurveyModal from "./SurveyModal";
import { useEffect, useState } from "react";
import { toPersianDate } from "@/lib/utils";

interface Survey {
  id: string;
  name: string;
  endDate: string;
  questions: string[];
}

const columns: ColumnDef<Survey>[] = [
  {
    header: "نام نظرسنجی",
    accessorKey: "name",
  },
  {
    header: "تاریخ پایان",
    accessorKey: "endDate",
    cell({ getValue }) {
      return toPersianDate(new Date(getValue() as string));
    },
  },
  {
    header: " ",
    cell: ({ row }) => {
      const survey = row.original;
      return <SurveyModal survey={survey} />;
    },
  },
];

export default function SurvayList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/survey")
      .then((res) => res.json())
      .then((surveys) => {
        setData(surveys.filter((survey: any) => survey.isActive));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="text-center py-8">درحال بارگذاری...</div>;
  }

  return (
    <>
      {data.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold mb-5 mt-4 text-neutral-800 dark:text-neutral-900">
            لیست نظرسنجی‌ها
          </h2>

          <div className="w-full overflow-x-auto xl:overflow-x-visible rounded-lg border">
            <table className="w-full table-auto border-collapse">
              <thead className="sticky top-0 z-10 bg-neutral-100 dark:bg-neutral-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`
                      px-2 py-2
                      text-xs sm:text-sm
                      font-extrabold
                      text-neutral-800 dark:text-neutral-900
                      text-center
                      whitespace-nowrap first:text-right first:pr-4 first:rounded-tr-lg last:rounded-tl-lg 
                      ${
                        index === headerGroup.headers.length - 1
                          ? "w-px"
                          : "w-auto"
                      }
                      `}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-100 border-b last:border-b-0"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className={`
                      px-2  py-1.5
                      text-center
                      text-sm
                      font-medium
                      text-neutral-700 dark:text-neutral-800
                      
                      whitespace-nowrap  first:text-right first:pr-4 
                      ${
                        index === row.getVisibleCells().length - 1
                          ? "w-px"
                          : "w-auto"
                      }
                    `}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className=" w-full h-[calc(100dvh-244px)] flex justify-center items-center">
          <p className=" font-medium text-xl">
            هیچ نظرسنجی‌ای برای شرکت کردن وجود نداره☹️
          </p>
        </div>
      )}
    </>
  );
}
