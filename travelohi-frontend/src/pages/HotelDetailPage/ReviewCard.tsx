import Divider from '../../components/Divider/Divider'
import { Review} from '../../models/Hotel'
import styles from './ReviewCard.module.scss'

interface ReviewCardProps {
    review : Review;
}

const ReviewCard : React.FC<ReviewCardProps> = ({review}) => {


    const reviewDate = new Date(review.CreatedAt);

    const presentableDate = reviewDate.toLocaleDateString("en-US", {
        weekday: 'long', // Name of the day
        year: 'numeric', // Year
        month: 'long', // Month
        day: 'numeric', // Day
      });

    return (
        <div className={styles.container}>
            <Divider />
            <div className={styles.reviewContent}>
                <div className={styles.leftReview}>
                    <div className={styles.reviewRating}>
                        {review.rating.toFixed(1)}
                    </div>
                    <div className={styles.reviewerName}>
                        {review.user.first_name}
                    </div>
                </div>
                <div className={styles.rightReview}>
                    <div className={styles.rightReviewContent}>
                        <div className={styles.reviewComment}>
                            "{review.comment}"
                        </div>
                        <div className={styles.reviewDate}>
                            Reviewed At {presentableDate}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard