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
      className={`grid grid-cols-2 gap-2 border border-[#333] divide-x divide-[#333]  ${containerClassName}`}
    >
      <div
        className={`flex items-center justify-center py-2 text-white hover:bg-[#2C2C2C] transition-colors ${labelClassName}`}
      >
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div
        className={`flex items-center justify-center py-3 text-white hover:bg-[#2C2C2C] transition-colors ${valueClassName}`}
      >
        <span className="text-sm text-gray-400">{value}</span>
      </div>
    </div>
  );
};

export default LabelValueRow;
