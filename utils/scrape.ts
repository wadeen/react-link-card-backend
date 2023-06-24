import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { assert } from "https://deno.land/std@0.192.0/testing/asserts.ts";

export const handleGet = async (url: URL) => {
  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) {
    return new Response("Missing 'url' query parameter", { status: 400 });
  }
  const res = await fetch(targetUrl);
  const body = await res.text();
  const document = new DOMParser().parseFromString(body, "text/html");
  assert(document);

  const title = document?.querySelector("title")?.textContent;
  const description = document?.querySelector('meta[name="description"]')
    ?.getAttribute(
      "content",
    );

  const ogp = (() => {
    const targetOgp = document?.querySelector('meta[property^="og:image"]')
      ?.getAttribute("content");
    if (targetOgp?.startsWith("http")) {
      return targetOgp;
    } else {
      return targetUrl + targetOgp;
    }
  })();

  const favicon = (() => {
    const targetFavicon = document?.querySelector('link[rel="icon"]')
      ?.getAttribute("href");
    if (targetFavicon?.startsWith("http")) {
      return targetFavicon;
    } else {
      return targetUrl + targetFavicon;
    }
  })();

  return {
    title,
    description,
    ogp,
    favicon,
  };
};
