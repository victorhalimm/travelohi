import styles from "./Sidebar.module.scss";
import SidebarButton, { SidebarBtnProps } from "./SidebarButton";

interface SidebarProps {
  menuItems: SidebarBtnProps[];
  activeMenu: string;
  handleMenuChange(menu : string) : void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeMenu , handleMenuChange}) => {
  return (
    <div className={styles.sidebarContainer}>
      {menuItems.map((menuItem) => (
        <SidebarButton
          key={menuItem.title}
          icon={menuItem.icon}
          title={menuItem.title}
          isActive={menuItem.title === activeMenu}
          handleClick={handleMenuChange}
        />
      ))}
    </div>
  );
};

export default Sidebar;
