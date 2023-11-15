import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="py-8 w-full text-center border-b border-blue-400">
      <Image
        alt="Projeto Visão Acessível"
        className="mx-auto mb-6"
        height="72"
        width="330"
        src="/visao-acessivel-logo.png"
        draggable="false"
      />
    </header>
  );
};

export default Header;
