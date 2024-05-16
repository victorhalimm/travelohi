// Assuming you're using TypeScript, the file extension should be .tsx if it's not already.
import React from 'react'; // Import React
import Navbar from "../../components/Navbar/Navbar";
import styles from './MainLayout.module.scss';
import Footer from '../../components/Footer/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {


  
  return (
    <>
      <Navbar />
      <div className={styles.pageBg}> 
        {children}
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
