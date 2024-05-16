import { IconType } from "react-icons";
import styles from "./SidebarButton.module.scss";

export interface SidebarBtnProps {
  icon: IconType;
  title: string;
  isActive: boolean;
  handleClick ? (menu : string)  : void;
}

const SidebarButton: React.FC<SidebarBtnProps> = ({ icon: Icon, title , isActive, handleClick = () => 0}) => {
  return (
    <div className={`${isActive ? styles.activeButton : styles.buttonContainer}`} onClick={()=> handleClick(title)}>
      <div className={`${styles.iconContainer} `}>
        <Icon />
      </div>
      <div className={styles.textContainer}>{title}</div>
    </div>
  );
};

export default SidebarButton;
