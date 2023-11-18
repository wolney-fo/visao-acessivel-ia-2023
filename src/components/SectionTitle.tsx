import React from "react";

interface SectionTitleProps {
  text: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => {
  return (
    <h2 className="font-bold text-3xl p-4 border border-white rounded-full w-96 mx-auto mb-20">
      {text}
    </h2>
  );
};

export default SectionTitle;
