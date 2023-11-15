import { useState, useEffect } from "react";

// UI
import { Inter } from "next/font/google";
import { AiOutlineSound } from "react-icons/ai";
import { Language } from "@/config/interfaces";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userLanguage, setUserLanguage] = useState<Language | null>(null);
  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    fetch("/languages.json")
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data.languages);
        setUserLanguage(data.languages[0]);
      });
  }, []);

  const handleChangeUserLanguage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const languageCode = event.target.value;
    const languageObject = languages.find(
      (language) => language.code === languageCode
    );
    setUserLanguage(languageObject || null);
  };

  return (
    <main className={`text-center text-white ${inter.className}`}>
      <section className="py-24">
        <div className="w-4/5 mx-auto">
          <div className="flex justify-center gap-4 mb-6 items-center">
            <h2 className="text-2xl">Texto para</h2>
            <select
              value={userLanguage?.code}
              onChange={handleChangeUserLanguage}
              className="cursor-pointer py-4 px-6 bg-[#222b44]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="textToDescribe"
            id="textToDescribe"
            placeholder="Escreva aqui..."
            className="p-6 mb-8 text-xl w-full max-w-5xl bg-transparent border-2 border-white rounded-3xl"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={12}
          ></textarea>
          <button className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-24 rounded-lg">
            <AiOutlineSound />
          </button>
          <h2 className="text-2xl mb-6">Descrição de imagens</h2>
          <input
            type="file"
            name="imageToDescribe"
            id="imageToDescribe"
            className="mb-12"
          />
          <button className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-12 rounded-lg">
            <AiOutlineSound />
          </button>
        </div>
      </section>
    </main>
  );
}
