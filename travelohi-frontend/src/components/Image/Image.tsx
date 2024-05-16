import styles from './Image.module.scss'

interface ImageProps {
    imageUrl: string;
    width?: string;
    height?: string;
    alt?: string
}

const Image : React.FC<ImageProps> = ({imageUrl, height, width, alt}) => {
    return (
        <div style={{height: height, width: width}}>
            <img className={styles.image} src={imageUrl} alt={alt} />
        </div>
    )
}

export default Image;