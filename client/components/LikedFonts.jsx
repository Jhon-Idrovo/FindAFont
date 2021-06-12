function LikedFonts({ fonts }) {
  console.log(fonts);
  if (fonts.length === 0) {
    return <div>You have't liked any font</div>;
  }
  return (
    <div>
      {fonts.map((fontsSet) => (
        <div className="border-t-2 border-b-2 border-primary">
          {fontsSet.map((font) => (
            <p className="text-txt-base" style={{ fontFamily: font }}>
              {font}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LikedFonts;
