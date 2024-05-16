import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.headerText}>Featured</div>
        <Link to="/game" className={styles.link}>
          Game
        </Link>
        <Link to="/predict" className={styles.link}>
          Image Search
        </Link>
        <Link to="/settings" className={styles.link}>
          Profile
        </Link>
        <Link to="/cart" className={styles.link}>
          Cart
        </Link>
      </div>
      <div className={styles.column}>
        <div className={styles.headerText}>External</div>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Instagram
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Twitter
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Facebook
        </a>
        <a
          href="https://www.who.int"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          World Health Organization
        </a>
        <a
          href="https://www.traveloka.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Traveloka
        </a>
      </div>
    </div>
  );
};

export default Footer;
