import { useState, useEffect } from "react";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { ApiKeyCredentials } from "@azure/ms-rest-js";
import {
  AZURE_AI_COMPUTER_VISION_API_KEY,
  AZURE_AI_COMPUTER_VISION_ENDPOINT,
  AZURE_RESOURCES_API_REGION,
  AZURE_TEXT_TO_SPEECH_API_KEY,
  AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME,
} from "@/config/config";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";

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
  const [imageDescription, setImageDescription] =
    useState<string[]>([]);

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

  const describeImage = async () => {
    axios({
      url: AZURE_AI_COMPUTER_VISION_ENDPOINT,
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
        } else {
          console.error("Nenhum objeto encontrado na imagem.");
        }
      })
      .catch(function (error) {
        console.error(error);
        alert("Erro na chamada da API");
      });
  };

  const playTranscription = () => {
    if (transcribeToSpeechInput) {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        AZURE_TEXT_TO_SPEECH_API_KEY || "",
        AZURE_RESOURCES_API_REGION || ""
      );
      const speechSynthesizer = new sdk.SpeechSynthesizer(
        speechConfig,
        undefined
      );

      const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME}"><lang xml:lang="${userLanguage?.code}">${transcribeToSpeechInput}</lang></voice></speak>`;
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
            value={transcribeToSpeechInput}
            onChange={(e) => setTranscribeToSpeechInput(e.target.value)}
            rows={12}
          ></textarea>
          <button
            className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-24 rounded-lg"
            onClick={playTranscription}
          >
            <AiOutlineSound />
          </button>
          <h2 className="text-2xl mb-6">Descrição de imagens</h2>
          <input
            type="file"
            name="imageToDescribe"
            id="imageToDescribe"
            className="mb-12"
          />
          <button
            className="text-xl py-6 px-12 flex mx-auto bg-[#4b619c] mb-12 rounded-lg"
            onClick={describeImage}
          >
            <AiOutlineSound />
          </button>
          <p>{imageDescription}</p>
        </div>
      </section>
    </main>
  );
}
