import axios, { AxiosResponse, AxiosError } from "axios";
const { v4: uuidv4 } = require("uuid");
import {
  AZURE_AI_COMPUTER_VISION_API_KEY,
  AZURE_AI_COMPUTER_VISION_ENDPOINT,
} from "@/config/config";

interface ImageAnalysisResponse {
  denseCaptionsResult?: {
    values: { text: string }[];
  };
}

export const describeImage = async (imageUrl: string): Promise<string[]> => {
  try {
    const response: AxiosResponse<ImageAnalysisResponse> = await axios.post(
      `${AZURE_AI_COMPUTER_VISION_ENDPOINT}computervision/imageanalysis:analyze`,
      {
        url: imageUrl,
      },
      {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_AI_COMPUTER_VISION_API_KEY,
          "Content-Type": "application/json",
          "X-ClientTraceId": uuidv4(),
        },
        params: {
          "api-version": "2023-02-01-preview",
          features: "denseCaptions",
          language: "en",
          "gender-neutral-caption": false,
        },
        responseType: "json",
      }
    );

    if (
      response.data.denseCaptionsResult &&
      response.data.denseCaptionsResult.values
    ) {
      const objectsInImage: string[] = response.data.denseCaptionsResult.values.map(
        (value) => value.text
      );

      return objectsInImage;
    } else {
      console.error("Nenhum objeto encontrado na imagem.");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};
