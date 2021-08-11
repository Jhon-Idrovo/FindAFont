import { saveLikedFonts } from "../lib/firebaseUser";
import useUser from "../hooks/useUser";

function LikedFonts({ fonts, goBack }) {
  const { user } = useUser();
  console.log(fonts);
  if (fonts.length === 0) {
    return (
      <div className="text-txt-base text-center">
        You have't liked any font.. yet
        <button className="btn px-2 py-1 block mx-auto " onClick={goBack}>
          Go for it!
        </button>
      </div>
    );
  }
  return (
    <div>
      {fonts.map((fontsSet) => (
        <div className="border-b-2 border-secondary">
          {fontsSet.map((font) => (
            <p className="text-txt-base px-4" style={{ fontFamily: font }}>
              {font}
            </p>
          ))}
        </div>
      ))}
      {(user != null) & (user != "guest") ? (
        <button
          onClick={() => saveLikedFonts(fonts, user.id)}
          className="btn block mt-8 px-4 w-max mx-auto"
        >
          Save
        </button>
      ) : null}
      <button className="btn p-2 fixed bottom-6 left-6" onClick={goBack}>
        Back
      </button>
    </div>
  );
}

export default LikedFonts;
