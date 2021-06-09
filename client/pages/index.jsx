import Head from "next/head";
import { useEffect, useState } from "react";

import TextShowcase from "../components/TextShowcase";
import useFonts from "../hooks/useFonts";

export default function Home() {
  const { fonts, isLoadingFonts, error } = useFonts();
  //------------------------------------
  const [texts, setTexts] = useState([
    { fontIndex: 0, filters: [] },
    { fontIndex: 0, filters: [] },
  ]);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const handleFontChange = (change) => {
    const currentText = texts[activeTextIndex];
    const nextFont = fonts[currentText.fontIndex + change];
    //check if the font meets the restrictions
    if (currentText.filters.includes(nextFont.category))
      return handleFontChange(change);
    setTexts((prev) => {
      prev[activeTextIndex].fontIndex =
        prev[activeTextIndex].fontIndex + change;
      return JSON.parse(JSON.stringify(prev));
    });
  };

  //SAVE LIKED FONTS
  const [liked, setLiked] = useState([]);
  const saveFonts = () => {
    //save the current font(s) when "SAVE THIS" is pressed
    setLiked((prev) => [...prev, texts.map((t) => t.fontIndex)]);
    //send the info to the server
  };

  //TEXTS CONFIG
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({ bgCol: "#000000", txtCol: "#FFFFFF" });
  const changeTxtCol = (e) => {
    const newCol = e.target.value;
    setConfig((prev) => ({ ...prev, txtCol: newCol }));
  };
  const changeBgCol = (e) => {
    const newCol = e.target.value;
    setConfig((prev) => ({ ...prev, bgCol: newCol }));
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

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
        <button
          onClick={saveFonts}
          className="absolute bottom-2 w-full flex justify-center"
        >
          SAVE THIS
        </button>

        <div className="flex flex-col absolute top-16 bottom-16 right-20 left-28 border-2 border-txt-base">
          {fonts
            ? texts.map((t, index) => (
                <TextShowcase
                  config={config}
                  index={index}
                  font={fonts[t.fontIndex]}
                  setActive={setActiveTextIndex}
                />
              ))
            : null}
          <button
            onClick={() => setIsConfigOpen((prev) => !prev)}
            className="absolute -top-8 right-0"
          >
            ...
            <ul
              className={`absolute top-8 right-0 overflow-hidden transition-all bg-base ${
                isConfigOpen ? "max-h-screen" : "max-h-0"
              }`}
            >
              <li>
                Font Color
                <input
                  value={config.txtCol}
                  onChange={changeTxtCol}
                  type="color"
                  id="font-color-picker"
                />
              </li>
              <li>
                Background Color
                <input
                  value={config.bgCol}
                  onChange={changeBgCol}
                  type="color"
                  id="bg-color-picker"
                />
              </li>
            </ul>
          </button>
          <button
            onClick={() => {
              setIsFullScreen((prev) => !prev);
            }}
          ></button>
        </div>
      </main>
    </>
  );
}
