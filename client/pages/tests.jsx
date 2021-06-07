import Checkout from "../components/Checkout";
import { useEffect, useState } from "react";

import axios from "axios";

function Tests() {
  //FULL FONTS LIST
  const [fonts, setFonts] = useState(false);
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
  }, []);
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
  };

  //SEE SELECTIONS

  return (
    <div>
      <div>
        {fonts
          ? fonts.map(({ family }) => (
              <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css?family=${family}`}
              />
            ))
          : null}
      </div>
      <div>
        {fonts &&
          texts.map((text, index) => {
            return (
              <TextFrame
                index={index}
                setActiveTextIndex={setActiveTextIndex}
                font={fonts[text.fontIndex]}
                key={index}
              />
            );
          })}
      </div>
      <button onClick={() => handleFontChange(+1)}>Next</button>
      <button onClick={saveFonts}>Save</button>
    </div>
  );
}

export default Tests;

function TextFrame({ font, setActiveTextIndex, index }) {
  console.log(font);

  //variants and textarea
  return (
    <div>
      <textarea
        onClick={() => setActiveTextIndex(index)}
        style={{
          fontFamily: `${font.family},serif`,
        }}
        cols="30"
        rows="10"
      ></textarea>
    </div>
  );
}
