import Link from "next/link";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();
  return (
    <nav className=" p-2 h-10 flex justify-between items-center  bg-primary text-txt-primary">
      <Link href="/">
        <a>Find A Font</a>
      </Link>
      <ul className="flex justify-between items-center">
        <li className="nav-list-item">Excluded Fonts</li>
        <li className="nav-list-item">Most Liked</li>
        <li className="nav-list-item">Collections</li>
        <li className="nav-list-item">Buy me a sandwich</li>
        <li className="nav-list-item">
          <div>U</div>
        </li>
      </ul>
    </nav>
  );

  // return (
  //   <nav className="nav-bar">
  //     <Link href="/">
  //       <a>LOGO</a>
  //     </Link>
  //     <div className="nav-menu">
  //       <input type="checkbox" id="menu-check" />
  //       <div></div>
  //       <ul className="nav-list">
  //         <li>Products</li>
  //         <li>About</li>
  //         <li>Community</li>
  //         <li>Find Us</li>
  //         <li>FAQ</li>
  //         <li className="hover:border-opacity-0 ">
  //           <button type="button" className="btn-base">
  //             Buy Now
  //           </button>
  //         </li>
  //       </ul>
  //     </div>
  //   </nav>
  // );
}

export default NavBar;
