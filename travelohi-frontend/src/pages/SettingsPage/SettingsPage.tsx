import {
  FaBell,
  FaCoins,
  FaInfoCircle,
  FaRegListAlt,
  FaRegUserCircle,
  FaSignOutAlt,
  FaUserCheck,
} from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import styles from "./SettingsPage.module.scss";
import { MdAirplaneTicket } from "react-icons/md";
import { SidebarBtnProps } from "../../components/Sidebar/SidebarButton";
import { useState } from "react";
import AccountSection from "./AccountSection";
import { useNavigate } from "react-router-dom";


const SettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Akun Saya");
  const navigate = useNavigate();

  
  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);

    if (menu === 'Keluar dari akun') {
      handleSignOut();
    }
  };
  
  const handleSignOut = async () => {
    
    try {
      const response = await fetch("http://127.0.0.1:3000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        
        navigate('/home')
        
      } else {
        console.error("Login failed:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    
  }
  const menuItems: SidebarBtnProps[] = [
    { icon: FaCoins, title: "Poin Saya", isActive: false },
    { icon: MdAirplaneTicket, title: "Pesanan Saya", isActive: false },
    { icon: FaRegListAlt, title: "Daftar Pembelian", isActive: false },
    { icon: FaBell, title: "Notifikasi Harga Penerbangan", isActive: false },
    { icon: FaUserCheck, title: "Passenger Quick Pick", isActive: false },
    { icon: FaInfoCircle, title: "Info Promo", isActive: false },
    { icon: FaRegUserCircle, title: "Akun Saya", isActive: false },
    { icon: FaSignOutAlt, title: "Keluar dari akun", isActive: false },
  ];

  return (
    <div className={styles.pageBg}>
      <Navbar />
      <div className={styles.profileContainer}>
        <Sidebar
          handleMenuChange={handleMenuChange}
          activeMenu={activeMenu}
          menuItems={menuItems}
        />
        {activeMenu === "Akun Saya" && <AccountSection />}
      </div>
    </div>
  );
};

export default SettingsPage;
