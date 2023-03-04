import { Form, Link, NavLink } from "@remix-run/react";

export default function Navbar() {
    const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"];

    return (
        <header className="navbar bg-base-100">
            <div className="navbar-start">
                {/* Menu dropdown for smaller sizes */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <NavLink
                                className={({ isActive }) =>
                                    `${isActive ? "underline" : ""}`
                                }
                                to="/adventures"
                            >
                                My Adventures
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <Link className="btn btn-ghost normal-case text-xl" to="/">MNA</Link>
            </div>
            {/* Menu list for big sizes */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `${isActive ? "underline" : ""}`
                            }
                            to="/adventures"
                        >
                            My Adventures
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <select data-choose-theme className="select select-ghost">
                    <option value="">Default</option>
                    {themes.map(theme => <option key={theme} value={theme}>{`${theme.charAt(0).toUpperCase()}${theme.slice(1)}`}</option>)}
                </select>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="btn"
                    >
                        Logout
                    </button>
                </Form>
            </div>
        </header>
    );
}