import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";

const denoOgHandler = async (req: Request) => {
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

const handleGet = async (url: URL) => {
  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    return new Response("Missing 'url' query parameter", { status: 400 });
  }
  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Twitterbot/1.0",
    },
  });

  const response = await res.text();
  const document = new DOMParser().parseFromString(response, "text/html");
  assert(document);

  const ogTitle = document?.querySelector("title")?.textContent;
  const ogDescription = document?.querySelector('meta[name="description"]')
    ?.getAttribute(
      "content",
    );

  const ogImage = (() => {
    const targetOgImage = document?.querySelector('meta[property^="og:image"]')
      ?.getAttribute("content");
    if (!targetOgImage) return;
    if (targetOgImage?.startsWith("http")) {
      return targetOgImage;
    } else {
      return targetUrl + targetOgImage;
    }
  })();

  const favicon = (() => {
    const targetFavicon = document?.querySelector('link[rel="icon"]')
      ?.getAttribute("href");
    if (!targetFavicon) return;
    if (targetFavicon?.startsWith("http")) {
      return targetFavicon;
    } else {
      return targetUrl + targetFavicon;
    }
  })();

  return {
    ogTitle,
    ogDescription,
    ogImage,
    favicon,
  };
};

export default denoOgHandler;
