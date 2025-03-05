import React from "react";

const LabelValueRow = ({
  label,
  value,
  containerClassName = "",
  labelClassName = "",
  valueClassName = "",
}) => {
  return (
    <div
      className={`grid grid-cols-2 border border-[#333] rounded mb-2 ${containerClassName}`}
    >
      <div
        className={`flex items-center justify-start px-4 py-2 text-white ${labelClassName}`}
      >
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div
        className={`flex items-center justify-end px-4 py-2 text-white ${valueClassName}`}
      >
        <span className="text-sm text-gray-400">{value}</span>
      </div>
    </div>
  );
};

export default LabelValueRow;
