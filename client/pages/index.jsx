import Head from "next/head";
import { useEffect, useState } from "react";

import TextArea from "../components/TextArea";
import LikedFonts from "../components/LikedFonts";
import Loading from "../components/Loading";
import useFonts from "../hooks/useFonts";

import axios from "axios";
import { db } from "../lib/firebase";
import useUser from "../hooks/useUser";
import { useQuery } from "react-query";

export default function Home() {
  //fetch fonts
  const GoogleFontsAPIKey = "AIzaSyBURN0QbZlqbqoUPbIKdRhcDkH_Xz2taAs";
  async function fetchFontsList() {
    const res = await axios.get(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GoogleFontsAPIKey}`
    );
    if (res.status === 200) {
      return res.data.items;
    } else {
      throw Error("Something went wring while fetching the fonts");
    }
  }
  const {
    data: fonts,
    error,
    isLoading: isLoadingFonts,
  } = useQuery("fonts", fetchFontsList);
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
    //advance to the next font
    handleFontChange(+1);
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
        <LikedFonts fonts={liked} goBack={() => setIsShowingLiked(false)} />
      ) : (
        <main className="fixed top-10 bottom-0 right-0 left-0 text-txt-base bg-base">
          <div className="absolute top-6 w-full flex flex-col items-center">
            <button onClick={doNotShowFont} className="">
              DON'T SHOW AGAIN
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
            className="absolute bottom-8 flex w-full justify-center"
          >
            SAVE
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
                className={`absolute top-6 right-0 overflow-hidden transition-all bg-base ${
                  isConfigOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                <li>
                  <form
                    onSubmit={handleConfigSubmit}
                    className="flex flex-col p-2"
                  >
                    <label htmlFor="font-color-picker">Font Color</label>

                    <input type="color" id="font-color-picker" name="txtCol" />
                    <label htmlFor="bg-color-picker">Background Color</label>

                    <input type="color" id="bg-color-picker" name="bgCol" />
                    <button className="btn px-2 mt-2">Save</button>
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
            {!isLoadingFonts ? (
              texts.map((t, index) => (
                <TextArea
                  key={index}
                  config={config}
                  index={index}
                  font={fonts[t.fontIndex]}
                  setActive={setActiveTextIndex}
                />
              ))
            ) : (
              <Loading>
                <p>Loading fonts</p>
              </Loading>
            )}
          </div>
        </main>
      )}
    </>
  );
}
