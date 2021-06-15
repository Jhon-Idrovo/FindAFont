function LikedFonts({ fonts, goBack }) {
  console.log(fonts);
  if (fonts.length === 0) {
    return <div>You have't liked any font</div>;
  }
  return (
    <div>
      {fonts.map((fontsSet) => (
        <div className="border-t-2 border-collapse border-b-2 border-primary">
          {fontsSet.map((font) => (
            <p className="text-txt-base px-4" style={{ fontFamily: font }}>
              {font}
            </p>
          ))}
        </div>
      ))}
      <button className="btn p-2 fixed bottom-6 left-6" onClick={goBack}>
        Back
      </button>
    </div>
  );
}

export default LikedFonts;
