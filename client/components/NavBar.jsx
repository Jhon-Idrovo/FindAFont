import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "reactfire";
import { useContext } from "react";
import { UserContext } from "../lib/UserContext";

function NavBar() {
  const router = useRouter();

  const { user } = useContext(UserContext);
  return (
    <nav className=" p-2 h-10 flex justify-between items-center  bg-primary text-txt-primary">
      <Link href="/">
        <a>Find A Font</a>
      </Link>
      <ul className="flex justify-between items-center">
        <li className="nav-list-item">
          <Link href="/">
            <a>Test Fonts</a>
          </Link>
        </li>
        {user ? (
          <>
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

            <li className="nav-list-item">
              <div>{user.displayName.charAt(0)}</div>
            </li>
          </>
        ) : null}

        {/* <li className="nav-list-item"><Link href="/trending"><a>Trending</a></Link></li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
