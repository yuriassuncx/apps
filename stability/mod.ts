import { type App, type AppContext as AC } from "@deco/deco";
import manifest, { Manifest } from "./manifest.gen.ts";
import { Secret } from "../website/loaders/secret.ts";
import { createStability } from "./provider.ts";

interface State {
  stabilityClient: ReturnType<typeof createStability>;
}

interface Props {
  /**
   * @description The Stability AI API key
   */
  apiKey: Secret | string;
}

/**
 * @title Stability
 * @name Stability
 * @description This uses the Stability AI API to generate images from text descriptions.
 * @category Tool
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8
 */
export default function Stability(props: Props): App<Manifest, State> {
  const { apiKey } = props;
  const stability = createStability({
    apiKey: typeof apiKey === "string" ? apiKey : apiKey.get() || "",
  });

  return {
    state: {
      stabilityClient: stability,
    },
    manifest,
    dependencies: [],
  };
}

export type StabilityApp = ReturnType<typeof Stability>;
export type AppContext = AC<StabilityApp>;
