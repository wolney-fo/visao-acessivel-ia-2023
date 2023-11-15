import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="py-12 text-xl text-center text-white bg-[#1f2329]">
      <Image
        alt="Visão Acessível"
        className="mx-auto mb-6"
        height="52"
        width="52"
        src="/visao-acessivel.png"
        draggable="false"
      />
      <p className="max-w-24">
        Projeto realizado pelo Grupo 8 turma de Inteligência Artificial da Universidade Tiradentes 2023/2.
      </p>
    </footer>
  );
};

export default Footer;
