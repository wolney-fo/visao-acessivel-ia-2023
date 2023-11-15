import { useState, useEffect } from "react";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// UI
import { Inter } from "next/font/google";
import { AiOutlineSound } from "react-icons/ai";
import { Language } from "@/config/interfaces";
import { AZURE_RESOURCES_API_REGION, AZURE_TEXT_TO_SPEECH_API_KEY, AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME } from "@/config/config";

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

  const playTranscription = () => {
    if (userInput) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        AZURE_TEXT_TO_SPEECH_API_KEY || "",
        AZURE_RESOURCES_API_REGION || ""
      );
      const speechSynthesizer = new sdk.SpeechSynthesizer(
        speechConfig,
        undefined
      );

      const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME}"><lang xml:lang="${userLanguage?.code}">${userInput}</lang></voice></speak>`;
      speechSynthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.errorDetails) {
            console.error(result.errorDetails);
          }

          speechSynthesizer.close();
        },
        (error) => {
          console.log(error);
          speechSynthesizer.close();
        }
      );
    }
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
          <button className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-24 rounded-lg" onClick={playTranscription}>
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
