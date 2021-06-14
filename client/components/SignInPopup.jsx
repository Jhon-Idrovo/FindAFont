import FirebaseAuth from "./FirebaseAuth";

function SignInPopup({ close }) {
  return (
    <div className="flex flex-col justify-center items-center bg-base fixed top-0 left-0 right-0 bottom-0 z-50">
      <div className="flex flex-col w-1/3 h-1/2 bg-base shadow-lg">
        <button onClick={close} className="inline-block self-end">
          <i class="fas fa-times"></i>
        </button>
        <FirebaseAuth />
      </div>
    </div>
  );
}

export default SignInPopup;
