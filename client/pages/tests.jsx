import Checkout from "../components/Checkout";
import { useEffect, useState } from "react";

import axios from "axios";

function Tests() {
  //FULL FONTS LIST
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

  //ACTIVE TEXTAREA
  const [activeText, setActiveText] = useState(0);

  //SELECTED FONT (as an index)
  const [activeFonts, setActiveFonts] = useState([0, 0]);
  //[filters for text 1, filter for text2,...]
  const [filters, setFilters] = useState([]);

  const handleFontChange = (change, textIndex) => {
    const nextFont = fonts[activeFonts[textIndex] + change];
    //check if the font meets the restrictions
    if (filters[textIndex].includes(nextFont.category))
      return handleFontChange(change, textIndex);
    setActiveFonts((prev) => {
      prev[textIndex] = activeFonts[textIndex] + change;
      return prev;
    });
  };

  return (
    <div>
      <div>
        {fonts?.map(({ family }) => (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css?family=${family}`}
          />
        ))}
      </div>
      <div>
        {fonts
          ? activeFonts.map((fontIndex, index) => {
              console.log(fontIndex, index, fonts);
              return (
                <TextFrame
                  index={index}
                  activate={setActiveText}
                  font={fonts[fontIndex]}
                  key={index}
                />
              );
            })
          : null}
      </div>
      <button onClick={() => handleFontChange(+1, activeText)}>Next</button>
    </div>
  );
}

export default Tests;

function TextFrame({ font, activate, index }) {
  console.log(font);

  //variants and textarea
  return (
    <div>
      <textarea
        onClick={() => activate(index)}
        style={{
          fontFamily: `${font.family},serif`,
        }}
        cols="30"
        rows="10"
      ></textarea>
    </div>
  );
}
