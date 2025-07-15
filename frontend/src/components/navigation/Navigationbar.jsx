// style
import styles from "./admin-nav.module.css";

// react
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TicketDetail from "../tickets/TicketDetail";

export default function AdminNav() {
  const location = useLocation();
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openNotifModal, setOpenNotifModal] = useState(false);


  // modal close when the page is resize
  useEffect(() => {
    const handleResize = () => {
      setOpenProfileModal(false);
      setOpenNotifModal(false);
      setUserMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    // clean event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Burger Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false);
  };

  // Three dots Menu
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    setMenuOpen(false);
    setOpenProfileModal(false);
    setOpenNotifModal(false);
  };


  return (
    <>
      <nav className={styles.navBar}>
        {/* logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoImg}>
            <img
              src="/map-logo.png" // relative to the public folder
              alt="logo"
            />
          </div>

          <p>
            {/* Ticket<span>Flow</span> */}
            <span>TicketFlow</span>
          </p>

          <span className={styles.anAdminLogo}>admin</span>
        </div>

        {/* nav-links */}
        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/ticket"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            ticket
          </NavLink>

          <NavLink
            to="/workflow"
            end
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Workflow
          </NavLink>
          <div className={styles.dropdown}>
          <span className={styles.navLink}>Styles ▾</span>
          <div className={styles.dropdownContent}>
            <NavLink
              to="/style1"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Style 1
            </NavLink>
            <NavLink
              to="/style2"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Style 2
            </NavLink>
            <NavLink
              to="/style3"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              Style 3
            </NavLink>
          </div>
        </div>

        </div>

        <div
          className={`${styles.userSection} ${
            userMenuOpen ? styles.userSectionOpen : ""
          }`}
        >
          {" "}
          <div className={styles.notifBell}>
            <i className="fa fa-bell"></i>
          </div>
          <img
            className={styles.userAvatar}
            src="https://i.pinimg.com/736x/e6/50/7f/e6507f42d79520263d8d952633cedcf2.jpg"
            alt="Anime Avatar"
          />
        </div>
      </nav>
    </>
  );
}