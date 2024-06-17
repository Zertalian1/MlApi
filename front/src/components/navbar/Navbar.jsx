import Links from "./links/Links"
import styles from './navbar.module.css'

import { Anonymous_Pro } from 'next/font/google'

const inter = Anonymous_Pro(
  { 
    subsets: ['latin'],
    weight: '400'
  }
)

const Navbar = () => {
  return (
    <nav className={styles.navbar} style={inter.style}>
      <ul className={styles.navbarList}>
        <li className={styles.navbarItem}>
        <Links />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar