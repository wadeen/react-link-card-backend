import { handleGet } from "../../utils/scrape.ts";

export const handler = async (req: Request) => {
  const url = new URL(req.url);
  try {
    const result = await handleGet(url);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(`Error scraping url: ${error.message}`, {
      status: 500,
    });
  }
};
