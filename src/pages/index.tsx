import { useState, useEffect } from "react";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {
  AZURE_AI_COMPUTER_VISION_API_KEY,
  AZURE_AI_COMPUTER_VISION_ENDPOINT,
  AZURE_RESOURCES_API_REGION,
  AZURE_TEXT_TO_SPEECH_API_KEY,
  AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME,
} from "@/config/config";

// UI
import { Inter } from "next/font/google";
import { AiOutlineSound } from "react-icons/ai";
import { Language } from "@/config/interfaces";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userLanguage, setUserLanguage] = useState<Language | null>(null);
  const [transcribeToSpeechInput, setTranscribeToSpeechInput] =
    useState<string>("");
  const [imageToDescribeUrl, setImageToDescribeUrl] = useState<string>(
    "https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png"
  );
  const [imageDescription, setImageDescription] = useState<string[]>([]);

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
  
  const handleTranscribeToSpeechButton = () => {
    textToSpeech(transcribeToSpeechInput);
  }

  const describeImage = async () => {
    setImageDescription(["Carregando..."]);
    axios({
      url: `${AZURE_AI_COMPUTER_VISION_ENDPOINT}computervision/imageanalysis:analyze`,
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_AI_COMPUTER_VISION_API_KEY,
        "Content-Type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "2023-02-01-preview",
        features: "denseCaptions",
        language: "en",
        "gender-neutral-caption": false,
      },
      data: {
        url: imageToDescribeUrl,
      },

      responseType: "json",
    })
      .then(function (response) {
        if (
          response.data.denseCaptionsResult &&
          response.data.denseCaptionsResult.values
        ) {
          const objectsInImage: string[] =
            response.data.denseCaptionsResult.values.map(
              (value: any) => value.text
            );
          setImageDescription(objectsInImage);
          textToSpeech(objectsInImage[0]);
        } else {
          console.error("Nenhum objeto encontrado na imagem.");
        }
      })
      .catch(function (error) {
        console.error(error);
        setImageDescription(["Erro ao descrever imagem"]);
        alert("Erro na chamada da API");
      });
  };

  const textToSpeech = (textToPlay: string) => {
    if (textToPlay) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        AZURE_TEXT_TO_SPEECH_API_KEY || "",
        AZURE_RESOURCES_API_REGION || ""
      );
      const speechSynthesizer = new sdk.SpeechSynthesizer(
        speechConfig,
        undefined
      );

      const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME}"><lang xml:lang="${userLanguage?.code}">${textToPlay}</lang></voice></speak>`;
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
          <div>
            <h2 className="text-2xl mb-6">Descrição de imagens</h2>
            <img
              src={imageToDescribeUrl}
              alt={imageDescription[0]}
              className="w-3/4 mx-auto rounded-3xl mb-8"
            />
            <p className="py-4 w-72 mb-8 mx-auto border border-white bg-[#222b44]">{imageDescription[0]}</p>
            <ul className="list-none m-w-12">
              {imageDescription.map((obj) => (
                <li className="py-4 w-72 my-4 mx-auto bg-[#222b44]" key={crypto.randomUUID()}>{obj}</li>
              ))}
            </ul>
            <button
              className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-12 rounded-lg"
              onClick={describeImage}
            >
              <AiOutlineSound />
            </button>
          </div>
          <h2 className="text-4xl my-24">Ou</h2>
          <div>
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
              value={transcribeToSpeechInput}
              onChange={(e) => setTranscribeToSpeechInput(e.target.value)}
              rows={12}
            ></textarea>
            <button
              className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-24 rounded-lg"
              onClick={handleTranscribeToSpeechButton}
            >
              <AiOutlineSound />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
