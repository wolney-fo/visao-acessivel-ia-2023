import axios, { AxiosResponse, AxiosError } from "axios";
const { v4: uuidv4 } = require("uuid");
import {
  AZURE_AI_TRANSLATOR_API_ENDPOINT,
  AZURE_AI_TRANSLATOR_API_KEY,
  AZURE_RESOURCES_API_REGION,
} from "@/config/config";

interface TranslationResponse {
  translations: { text: string }[];
}

export const translateText = async (
  translateFrom: string,
  translateTo: string,
  textToTranslate: string
): Promise<string> => {
  try {
    const response: AxiosResponse<TranslationResponse[]> = await axios.post(
      "/translate",
      [
        {
          text: textToTranslate,
        },
      ],
      {
        baseURL: AZURE_AI_TRANSLATOR_API_ENDPOINT,
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_AI_TRANSLATOR_API_KEY,
          "Ocp-Apim-Subscription-Region": AZURE_RESOURCES_API_REGION,
          "Content-Type": "application/json",
          "X-ClientTraceId": uuidv4(),
        },
        params: {
          "api-version": "3.0",
          from: translateFrom,
          to: [translateTo],
        },
        responseType: "json",
      }
    );

    const translated: string = response.data[0]?.translations[0]?.text;

    if (translated) {
      return translated;
    } else {
      console.error("Erro ao traduzir o texto.");
      return "";
    }
  } catch (error) {
    console.error(error);
    return "";
  }
};
