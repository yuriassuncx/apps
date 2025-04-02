import { AppContext } from "../mod.ts";
import { uploadImage } from "./generateImage.ts";
import { ASPECT_RATIOS, ControlStyleOptions } from "../stabilityAiClient.ts";

/**
 * @name CONTROL_STYLE
 * @description Generate a new image in the style of a reference image
 */
export interface Props {
  /**
   * @description The URL of the style reference image
   */
  imageUrl: string;
  /**
   * @description The presigned URL to upload the modified image to
   */
  presignedUrl: string;
  /**
   * @description What you wish to see in the output image
   */
  prompt: string;
  /**
   * @description Optional description of what you don't want to see
   */
  negativePrompt?: string;
  /**
   * @description Optional aspect ratio for the generated image
   */
  aspectRatio?: typeof ASPECT_RATIOS[number];
  /**
   * @description How closely the output image's style should match the input (0-1)
   */
  fidelity?: number;
}

async function handleControlStyle(
  imageBuffer: Uint8Array,
  options: ControlStyleOptions,
  presignedUrl: string,
  ctx: AppContext,
) {
  try {
    console.log("Starting control style process...");
    console.log("Options:", options);
    console.log("Image buffer length:", imageBuffer.length);

    const { stabilityClient } = ctx;
    console.log("Initiating control style request...");
    const result = await stabilityClient.controlStyle(imageBuffer, options);
    console.log(
      "Control style completed, image length:",
      result.base64Image.length,
    );

    console.log("Starting image upload...");
    await uploadImage(result.base64Image, presignedUrl);
    console.log("Image upload completed successfully");
  } catch (error) {
    console.error("Error in control style:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default async function controlStyle(
  { imageUrl, presignedUrl, prompt, negativePrompt, aspectRatio, fidelity }:
    Props,
  _request: Request,
  ctx: AppContext,
) {
  try {
    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = new Uint8Array(imageArrayBuffer);

    // Start the control style process in the background
    handleControlStyle(
      imageBuffer,
      { prompt, negativePrompt, aspectRatio, fidelity },
      presignedUrl,
      ctx,
    );

    // Return the final URL immediately
    const finalUrl = presignedUrl.replaceAll("_presigned_url", "");
    return {
      content: [
        {
          type: "text",
          text:
            `Started control style process with prompt "${prompt}". The result will be available at ${finalUrl} when complete.`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: `Error: Failed to start control style process: ${errorMessage}`,
        },
      ],
    };
  }
}
