import Image from "next/image";
import React from "react";

const LabelValueRow = ({
  label,
  value,
  containerClassName = "",
  labelClassName = "",
  valueClassName = "",
  imageSrc,
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
        <span className="text-sm text-gray-400 mr-2" >{value}</span>
        <Image src={imageSrc} alt="solana" width={18} height={18} />
      </div>
    </div>
  );
};

export default LabelValueRow;
