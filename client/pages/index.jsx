import Head from "next/head";
import { useEffect, useState } from "react";

import TextShowcase from "../components/TextShowcase";
import LikedFonts from "../components/LikedFonts";

import useFonts from "../hooks/useFonts";

import { db } from "../lib/firebase";
import useUser from "../hooks/useUser";

export default function Home() {
  const { fonts, isLoadingFonts, error } = useFonts();
  //------------------------------------
  const [texts, setTexts] = useState([
    { fontIndex: 0, filters: [] },
    { fontIndex: 0, filters: [] },
  ]);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  const handleFontChange = (change) => {
    setTexts((texts) => {
      const currentText = texts[activeTextIndex];
      const nextFont = fonts[currentText.fontIndex + change];
      const nextFontIndex = currentText.fontIndex + change;
      //check for negative index
      if (nextFontIndex < 0) {
        return texts;
      }
      //check if the font meets the restrictions
      if (
        currentText.filters.includes(nextFont.category) ||
        currentText.filters.includes(nextFontIndex)
      ) {
        setTimeout(() => {
          handleFontChange(change);
        }, 0);
        return texts;
      }
      texts[activeTextIndex].fontIndex = nextFontIndex;
      //to force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
  };

  const doNotShowFont = () => {
    setTexts((texts) => {
      texts[activeTextIndex].filters = [
        ...texts[activeTextIndex].filters,
        texts[activeTextIndex].fontIndex,
      ];
      //to force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
  };

  //SAVE AND SHOW LIKED FONTS
  const [liked, setLiked] = useState([]);
  const saveFonts = () => {
    //save the current font(s) when "SAVE THIS" is pressed
    setLiked((prev) => [...prev, texts.map((t) => fonts[t.fontIndex].family)]);
  };
  const [isShowingLiked, setIsShowingLiked] = useState(false);
  const { user, logOut } = useUser();
  const handleShowLiked = async () => {
    setIsShowingLiked(true);
    try {
      const likedFontsCollection = db
        .collection("users")
        .doc(user.uid)
        .collection("likedFonts");
      liked.map((likedList) =>
        likedFontsCollection.add({ fontFamilyNames: likedList })
      );
    } catch (e) {
      console.log(
        "An error happened while saving liked font's data to the database"
      );
    }
  };

  //TEXTS CONFIG
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({ bgCol: "#FFFFFF", txtCol: "#000000" });
  const changeTxtCol = (e) => {
    const newCol = e.target.value;
    setConfig((prev) => ({ ...prev, txtCol: newCol }));
  };
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    const txtCol = e.target[0].value;
    const bgCol = e.target[1].value;
    setConfig({ bgCol, txtCol });
  };

  const [isFullScreen, setIsFullScreen] = useState(false);

  //SETTING UP LISTENERS FOR THE KEYS
  useEffect(() => {
    const handleKeyPress = (e) => {
      const { key } = e;
      console.log(key);
      key === "ArrowUp" ? doNotShowFont() : null;
      key === "ArrowDown" ? saveFonts() : null;
      key === "ArrowLeft" ? handleFontChange(-1) : null;
      key === "ArrowRight" ? handleFontChange(+1) : null;
    };
    //suscribe to the events
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      //unsuscribe to the events
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
      {isShowingLiked ? (
        <LikedFonts fonts={liked} />
      ) : (
        <main className="fixed top-10 bottom-0 right-0 left-0 text-txt-base bg-base">
          <div className="absolute top-2 w-full flex flex-col items-center">
            <button onClick={doNotShowFont} className="">
              DONT SHOW ME THIS
            </button>
            {/* <select
            className="bg-base text-txt-base"
            name="hide-option"
            id="hide-option"
            >
            <option value="never">Don't show again</option>
            <option value="last">Show last</option>
          </select> */}
          </div>
          <button
            onClick={() => handleFontChange(-1)}
            className="absolute top-1/2 left-2"
          >
            PREVIOUS
          </button>
          <button
            onClick={() => handleFontChange(+1)}
            className="absolute top-1/2 right-6"
          >
            NEXT
          </button>
          <button
            onClick={saveFonts}
            className="absolute bottom-10 flex w-full justify-center"
          >
            SAVE THIS
          </button>
          <button
            onClick={handleShowLiked}
            className="absolute bottom-8 w-max right-4 btn py-2 px-4"
          >
            Next
          </button>
          <div
            className={`flex flex-col absolute  ${
              isFullScreen
                ? "top-0 bottom-0 right-0 left-0 z-10"
                : "top-16 bottom-16 right-24 left-24"
            } bg-base border-2 border-txt-base`}
          >
            <div className="flex justify-end mx-1 my-0">
              <button
                onClick={() => setIsConfigOpen((prev) => !prev)}
                className="mx-1"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <ul
                className={`absolute top-8 right-0 overflow-hidden transition-all bg-base ${
                  isConfigOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                <li>
                  <form onSubmit={handleConfigSubmit}>
                    <label htmlFor="font-color-picker">Font Color</label>

                    <input type="color" id="font-color-picker" name="txtCol" />
                    <label htmlFor="bg-color-picker">Background Color</label>

                    <input type="color" id="bg-color-picker" name="bgCol" />
                    <button>Save</button>
                  </form>
                </li>
              </ul>
              <button
                onClick={() => {
                  setIsFullScreen((prev) => !prev);
                }}
              >
                {isFullScreen ? (
                  <i class="fas fa-compress-arrows-alt"></i>
                ) : (
                  <i class="fas fa-expand-arrows-alt"></i>
                )}
              </button>
            </div>
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
          </div>
          {isShowingLiked && (
            <div className="w-screen h-screen bg-base bg-opacity-95"></div>
          )}
        </main>
      )}
    </>
  );
}
