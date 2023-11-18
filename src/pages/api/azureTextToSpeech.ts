import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import {
  AZURE_RESOURCES_API_REGION,
  AZURE_TEXT_TO_SPEECH_API_KEY,
  AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME,
} from "@/config/config";

export const textToSpeech = (textToPlay: string, language: string) => {
  if (textToPlay) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      AZURE_TEXT_TO_SPEECH_API_KEY || "",
      AZURE_RESOURCES_API_REGION || ""
    );
    const speechSynthesizer = new sdk.SpeechSynthesizer(
      speechConfig,
      undefined
    );

    const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${AZURE_TEXT_TO_SPEECH_API_SYNTHESIS_VOICE_NAME}"><lang xml:lang="${language}">${textToPlay}</lang></voice></speak>`;
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
