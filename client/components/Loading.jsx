function Loading({ children }) {
  return (
    <div>
      <div className="w-1/3 h-1/3 border-primary rounded-full"></div>
      {children}
    </div>
  );
}

export default Loading;
