import styles from "./PromoCard.module.scss";

export interface PromoCardProps {
  discount: number;
  name: string;
  code: string;
  image_url: string;
  type: string;
  expiry_date: string;
  width?: string; 
  height?: string; 
  onClick?: () => void;
}

const PromoCard: React.FC<PromoCardProps> = ({
  code,
  discount,
  name,
  image_url,
  type,
  expiry_date,
  width, // Destructure the new optional props
  height,
  onClick
}) => {
  const formattedDate = new Date(expiry_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const style = {
    width: width ? width : '100%', 
    height: height ? height : '80%', 
  };

  return (
    <div onClick={onClick} className={styles.container} style={style}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${image_url})` }}
      >
        <div className={styles.content}>
          <div className={styles.discount}>{discount}%</div>
          <div className={styles.header}>
            {name} | {type}
          </div>
          <div className={styles.code}>{code}</div>
          <div className={styles.date}>Exp. {formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
