import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "reactfire";
function NavBar() {
  const router = useRouter();
  const { data: user } = useUser();
  return (
    <nav className=" p-2 h-10 flex justify-between items-center  bg-primary text-txt-primary">
      <Link href="/">
        <a>Find A Font</a>
      </Link>
      <ul className="flex justify-between items-center">
        <li className="nav-list-item">
          <Link href="/exlcusion-list">
            <a>Exclusion List</a>
          </Link>
        </li>
        <li className="nav-list-item">
          <Link href="/collections">
            <a>Saved Collections</a>
          </Link>
        </li>
        <li className="nav-list-item">
          <Link href="/most-liked">
            <a>Most Liked</a>
          </Link>
        </li>
        {/* <li className="nav-list-item"><Link href="/trending"><a>Trending</a></Link></li> */}

        <li className="nav-list-item">
          {user ? <div>{user.displayName.charAt(0)}</div> : null}
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
