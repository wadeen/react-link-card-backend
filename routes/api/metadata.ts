import denoOgHandler from "../../utils/denoOgHandler.ts";

export const handler = async (req: Request) => {
  return await denoOgHandler(req);
};
