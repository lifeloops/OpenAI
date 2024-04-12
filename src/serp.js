async function searchGoogle() {
  const searchParams = {
    engine: "google",
    q: "OpenAI",
  };

  const searchResults = await serpapi.search(searchParams);
  console.log(searchResults);
}

searchGoogle();
