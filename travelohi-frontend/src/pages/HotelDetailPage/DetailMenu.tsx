import styles from './DetailMenu.module.scss';

export interface MenuItem {
    name : string,
    ref: React.RefObject<HTMLElement>;
}

interface DetailMenuProps {
    menuItems?: MenuItem[];
}


const DetailMenu : React.FC<DetailMenuProps> = ({menuItems}) => {

    const menus = ['Overview', 'Room Types', 'Reviews', 'Locations' ];

    

    return (
        <div className={styles.container}>
            {menus.map((menu) => (
                <div className={styles.menuItem}>
                    {menu}
                </div>
            ))}
        </div>
    )
}

export default DetailMenu;