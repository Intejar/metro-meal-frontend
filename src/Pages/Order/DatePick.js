import { bg } from "date-fns/locale";
import React from "react";
import { DayPicker } from "react-day-picker";

const DatePick = ({ selected, setSelected }) => {
  return (
    <div className="flex justify-center items-center bg-slate-800 rounded-lg">
      <div
        style={{
          padding: "16px",
          color: "#166534",
        }}
        className="w-full max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Select Dates
        </h2>
        <DayPicker
          mode="multiple"
          selected={selected}
          onSelect={setSelected}
          disabled={[{ before: new Date() }]}
          disableNavigation
          showOutsideDays
          styles={{
            caption: {
              color: "#166534",
              fontWeight: "bold",
              fontSize: "24px",
            },
            day: {
              color: "#ffffff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            selected: {
              backgroundColor: "#166534",
              color: "#ffffff",
            },
            head_cell: {
              color: "#166534",
              fontSize: "18px",
            },
            disabled: {
              color: "#9ca3af",
              cursor: "not-allowed",
              backgroundColor: "#e5e7eb", // light gray background for disabled dates
            },
          }}
        />
        <style jsx>{`
          .rdp-day:hover {
            background-color: #4ade80 !important; /* green-400 on hover */
            color: #ffffff !important;
          }

          .rdp-day_selected {
            background-color: #166534 !important;
            color: #ffffff !important;
          }

          .rdp-day_selected:hover {
            background-color: #166534 !important;
          }

          .rdp-day_disabled {
            color: #9ca3af !important; /* gray-400 color for disabled dates */
            background-color: #e5e7eb !important; /* Light gray for disabled dates */
            cursor: not-allowed;
          }

          .rdp-caption_label {
            font-size: 24px;
          }
          .rdp-day {
            margin: 0 3px;
          }

          @media (max-width: 640px) {
            .rdp-day {
              margin: 0 2px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DatePick;
