import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="py-8 w-full border-b border-white">
      <Image
        alt="Projeto Visão Acessível"
        className="ml-12"
        height="72"
        width="330"
        src="/visao-acessivel-logo.png"
        draggable="false"
      />
    </header>
  );
};

export default Header;
