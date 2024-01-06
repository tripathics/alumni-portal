import styles from './MembershipLayout.module.scss'
import { NavLink } from "react-router-dom"
import { Group as MemberIcon, Settings as SettingsIcon, LogOut as LogOutIcon } from 'iconoir-react'
import cx from 'classnames'
import { useLocation } from 'react-router-dom'
import { useUser } from '../../../contexts/UserContext'

const ProfileNavLink = ({ Icon, name, path, action = null, location }) => {
    return (
        <li>
            <NavLink to={path}
                onClick={(e) => {
                    if (action) action();
                }}
                className={cx(
                    styles['sidebar-nav-link'],
                    { [styles['active']]: location.pathname === path })
                }>
                {Icon && <Icon />}
                {name}
            </NavLink>
        </li>
    )
}

const ProfileNav = ({ title, links }) => {
    const location = useLocation();

    return (
        <nav className={`${styles["sidebar-nav"]}`}>
            <div className={`${styles["sidebar-nav-header"]}`}>
                <h2>{title}</h2>
            </div>
            <ul>
                {links.map((link, index) => (
                    <ProfileNavLink location={location} key={index} {...link} />
                ))}
            </ul>
        </nav>
    )
}

const MembershipLayout = ({ children }) => {
    const { logout } = useUser();

    const profileLinks = [
        { name: 'Membership', path: '/membership-registration', Icon: MemberIcon, },

    ]

    const accountLinks = [
        { name: 'Account settings', path: '/admin/account', Icon: SettingsIcon, },
        { name: 'Logout', path: '/', Icon: LogOutIcon, action: logout }
    ]

    return (
        <div className={`${styles["layout"]}`}>
            <div className={`${styles["sidebar"]}`}>
                <nav className={`${styles["sidebar-nav"]}`}>
                    <ProfileNav title="Membership form" links={profileLinks} />
                    <ProfileNav title="Account" links={accountLinks} />
                </nav>
            </div>

            <div className={`${styles["content"]}`}>
                {children}
            </div>
        </div>
    )
}

export default MembershipLayout;