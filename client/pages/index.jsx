import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  //All fonts
  const [fonts, setFonts] = useState([]);
  const GoogleFontsAPIKey = "AIzaSyBURN0QbZlqbqoUPbIKdRhcDkH_Xz2taAs";
  async function fetchFontsList() {
    const res = await axios.get(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GoogleFontsAPIKey}`
    );
    console.log(res);
    if (res.status === 200) {
      setFonts(res.data.items);
    }
  }
  useEffect(() => {
    fetchFontsList();
    return () => {};
  }, []);

  //SELECTED FONT
  const [activeFont, setActiveFont] = useState(0);
  const [filters, setFilters] = useState([]);
  const handleFontChange = (change) => {
    const nextFont = fonts[activeFont + change];
    //check if the font meets the restrictions
    if (filters.includes(nextFont.category)) return handleFontChange(+1);
    setActiveFont((prev) => prev + change);
  };

  return (
    <>
      <Head>
        <title>FindAFont</title>
        {fonts?.map(({ family }) => (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css?family=${family}`}
          />
        ))}
      </Head>
      <main className="fixed top-12 bottom-0 right-0 left-0 text-txt-base bg-base">
        <div className="absolute top-2 w-full flex flex-col items-center">
          <button className="">I HATE THIS</button>
          <select
            className="bg-base text-txt-base"
            name="hide-option"
            id="hide-option"
          >
            <option value="never">Don't show again</option>
            <option value="last">Show last</option>
          </select>
        </div>
        <button
          onClick={() => handleFontChange(-1)}
          className="absolute top-1/2 left-2"
        >
          PREVIOUS
        </button>
        <button
          onClick={() => handleFontChange(+1)}
          className="absolute top-1/2 right-2"
        >
          NEXT
        </button>
        <button className="absolute bottom-2 w-full flex justify-center">
          SAVE THIS
        </button>

        <div className="flex absolute top-16 bottom-16 right-20 left-28 border-2 border-txt-base">
          <div className="p-2 flex flex-col justify-center items-center">
            <h6>Variants:</h6>
            <ul>
              {fonts[activeFont]?.variants.map((v) => (
                <li>{v}</li>
              ))}
            </ul>
          </div>
          <textarea
            className="text-txt-base bg-base"
            style={{
              fontFamily: `${fonts[activeFont]?.family},serif`,
            }}
            cols="30"
            rows="10"
          ></textarea>
        </div>
      </main>
    </>
  );
}
