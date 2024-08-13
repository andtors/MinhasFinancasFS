

const NavbarItem = ({link, label, func}) => {
    return (
        <li className="nav-item me-4">
            <a className="nav-link" href={link} onClick={func}>{label}</a>
        </li>
    )
}

export default NavbarItem