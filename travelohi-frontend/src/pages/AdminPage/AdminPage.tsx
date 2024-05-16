import { FaPeopleGroup } from "react-icons/fa6";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SidebarBtnProps } from "../../components/Sidebar/SidebarButton";
import styles from "./AdminPage.module.scss";
import { FaEnvelope, FaHotel, FaPlane, FaUser } from "react-icons/fa";
import { useState } from "react";
import ManagePromotion from "./ManagePromotion";
import ManageHotel from "./ManageHotel";
import ManageUser from "./ManageUser";
import ManageNewsletter from "./ManageNewsletter";
import ManageFlight from "./ManageFlight";

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Manage Promotions");
  const menuItems: SidebarBtnProps[] = [
    { icon: FaPeopleGroup, title: "Manage Promotions", isActive: false },
    { icon: FaHotel, title: "Manage Hotels", isActive: false },
    { icon: FaPlane, title: "Manage Flights", isActive: false },
    { icon: FaUser, title: "Manage Users", isActive: false },
    { icon: FaEnvelope, title: "Manage Newsletters", isActive: false },
  ];

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
  };

  const ActiveMenu = () => {
    switch (activeMenu) {
        case 'Manage Promotions':
            return <ManagePromotion />
        case 'Manage Hotels':
            return <ManageHotel />
        case 'Manage Users':
          return <ManageUser />
        case 'Manage Newsletters':
          return <ManageNewsletter />
        case 'Manage Flights':
          return <ManageFlight />
    }
  }

  return (
    <div className={styles.pageBg}>
      <Navbar />

      <div className={styles.container}>
        <Sidebar
          menuItems={menuItems}
          activeMenu={activeMenu}
          handleMenuChange={handleMenuChange}
        />

        <ActiveMenu />
      </div>
    </div>
  );
};

export default AdminPage;
