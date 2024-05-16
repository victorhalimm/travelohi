import Divider from '../../components/Divider/Divider';
import styles from './FacilitiesCard.module.scss';
import { FaCheck } from 'react-icons/fa';

interface FacilitiesProps {
    facilities: string[];
}

const FacilitiesCard : React.FC<FacilitiesProps> = ({facilities}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>Facilities</div>
            <Divider />
            <div className={styles.content}>
                {facilities.map((facility) => (
                    <div className={styles.facility}>
                        <div>
                            <FaCheck />
                        </div>
                        <div>
                            {facility}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FacilitiesCard;