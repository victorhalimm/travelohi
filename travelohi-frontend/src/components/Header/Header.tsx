import styles from './Header.module.scss'

interface HeaderProps {
    children? : React.ReactNode,
    size?: 'h1' | 'h2' | 'h3' | 'big';
}

const Header : React.FC<HeaderProps> = ({children, size = 'h1'}) => {
    const className = `${styles.header} ${styles[size]}`;

    return (
        <div className={className}>
            {children}
        </div>
    )
}

export default Header;