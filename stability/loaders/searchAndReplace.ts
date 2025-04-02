import { AppContext } from "../mod.ts";
import { uploadImage } from "./generateImage.ts";

/**
 * @name SEARCH_AND_REPLACE
 * @description Replace objects or elements in an image by describing what to replace and what to replace it with.
 */
export interface Props {
  /**
   * @description The URL of the image to modify
   */
  imageUrl: string;
  /**
   * @description The presigned URL to upload the modified image to
   */
  presignedUrl: string;
  /**
   * @description Short description of what to replace in the image
   */
  searchPrompt: string;
  /**
   * @description What you wish to see in place of the searched content
   */
  prompt: string;
}

export default async function searchAndReplace(
  { imageUrl, presignedUrl, searchPrompt, prompt }: Props,
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

    console.log("Starting search and replace process...");
    console.log("Options:", { searchPrompt, prompt });
    console.log("Image buffer length:", imageBuffer.length);

    const { stabilityClient } = ctx;
    console.log("Initiating search and replace request...");
    const result = await stabilityClient.searchAndReplace(imageBuffer, {
      searchPrompt,
      prompt,
    });
    console.log(
      "Search and replace completed, image length:",
      result.base64Image.length,
    );

    console.log("Starting image upload...");
    await uploadImage(result.base64Image, presignedUrl);
    console.log("Image upload completed successfully");

    // Return the final URL
    const finalUrl = presignedUrl.replaceAll("_presigned_url", "");
    return {
      content: [
        {
          type: "text",
          text:
            `Successfully replaced "${searchPrompt}" with "${prompt}" in the image. The result is available at ${finalUrl}`,
        },
      ],
    };
  } catch (error) {
    console.error("Error in search and replace:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}
