/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";

// APIs
import { textToSpeech } from "./api/azureTextToSpeech";
import { translateText } from "./api/azureAiTranslator";
import { describeImage } from "./api/azureDenseCapitioning";

// UI
import { Inter } from "next/font/google";
import { AiOutlineSound } from "react-icons/ai";
import { TbZoomScan } from "react-icons/tb";

import { Language } from "@/config/interfaces";
import SectionTitle from "@/components/SectionTitle";
import { uiTranslations } from "@/config/translations";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userLanguage, setUserLanguage] = useState<Language>();

  const [imageToDescribeUrl, setImageToDescribeUrl] = useState<string>(
    "https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png"
  );
  const [imageDescriptionObjectsList, setImageDescriptionObjectsList] =
    useState<string[]>([]);
  const [imageFormattedDescription, setImageFormattedDescription] =
    useState<string>("");

  const [transcribeToSpeechInput, setTranscribeToSpeechInput] =
    useState<string>("");

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
    setUserLanguage(languageObject);
  };

  const handleTranscribeToSpeechButton = () => {
    userLanguage &&
      transcribeToSpeechInput &&
      textToSpeech(transcribeToSpeechInput, userLanguage.code);
  };

  const handleDescribeImage = async () => {
    try {
      setImageDescriptionObjectsList([]);

      const imageDescription = await describeImage(imageToDescribeUrl);

      let formattedDescription = imageDescription.join(", ");

      if (userLanguage?.code !== "en-GB" && userLanguage) {
        formattedDescription = await translateText(
          "en-GB",
          userLanguage?.code,
          formattedDescription
        );
      }

      setImageDescriptionObjectsList(formattedDescription.split(", "));

      if (userLanguage) {
        const formattedDescriptionToVoice = `${
          uiTranslations[userLanguage.code][0]
        } ${formattedDescription.split(", ")[0]}. ${
          uiTranslations[userLanguage?.code][1]
        } ${formattedDescription}`;

        setImageFormattedDescription(formattedDescriptionToVoice);
        
        textToSpeech(formattedDescriptionToVoice, userLanguage?.code);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleRepeatImageDescription = () => {
    userLanguage && textToSpeech(imageFormattedDescription, userLanguage?.code);
  }

  return (
    <main className={`text-center text-white ${inter.className}`}>
      <section className="w-3/4 mx-auto py-24">
        <select
          value={userLanguage?.code}
          onChange={handleChangeUserLanguage}
          className="cursor-pointer py-4 px-6 mb-20 bg-[#222b44]"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.language}
            </option>
          ))}
        </select>

        <SectionTitle text="Descrição de imagens" />
        <img
          src={imageToDescribeUrl}
          alt={imageDescriptionObjectsList[0]}
          className="w-full mx-auto rounded-2xl mb-8"
        />
        <div className="m-w-3/4text-xl flex justify-center gap-4 mb-10 items-center">
          <input
            type="text"
            placeholder="https://example.com/image.png/"
            className="w-full p-4 outline-none bg-[#222b44] rounded-lg"
            onChange={(e) => setImageToDescribeUrl(e.target.value)}
          />
          <button
            className="py-6 px-12 bg-[#4064da] rounded-lg"
            onClick={handleDescribeImage}
          >
            <TbZoomScan />
          </button>
        </div>

        {imageDescriptionObjectsList[0] && userLanguage && (
          <div className="p-6 text-lg text-left text-black bg-sky-200 rounded-lg">
            <h1 className="mb-6">
              {uiTranslations[userLanguage?.code][0]}{" "}
              <u>{imageDescriptionObjectsList[0]}</u>.
            </h1>
            <p className="mb-2">{uiTranslations[userLanguage?.code][1]}</p>
            <ul className="list-disc ml-4 mb-6">
              {imageDescriptionObjectsList.map((obj) => (
                <li key={crypto.randomUUID()}>{obj};</li>
              ))}
            </ul>
            <button className="flex gap-2 items-center text-sky-900" onClick={handleRepeatImageDescription}>
              <AiOutlineSound /> Ouvir novamente
            </button>
          </div>
        )}

        <h2 className="text-4xl my-24">Ou</h2>

        <h2 className="text-2xl mb-6">Texto para {userLanguage?.language}</h2>
        <textarea
          name="textToDescribe"
          id="textToDescribe"
          placeholder="Escreva aqui..."
          className="p-6 mb-8 text-xl w-full bg-transparent border-2 border-white rounded-3xl"
          value={transcribeToSpeechInput}
          onChange={(e) => setTranscribeToSpeechInput(e.target.value)}
          rows={12}
        ></textarea>
        <button
          className="text-xl py-6 px-12 flex mx-auto bg-[#4064da] mb-24 rounded-lg"
          onClick={handleTranscribeToSpeechButton}
        >
          <AiOutlineSound />
        </button>
      </section>
    </main>
  );
}
