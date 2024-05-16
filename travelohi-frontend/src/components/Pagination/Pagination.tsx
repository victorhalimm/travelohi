import styles from './Pagination.module.scss';

interface PaginationProps {
    postsPerPage : number;
    totalPosts : number;
    currentPage: number;
    paginate (pageNumber : number) : void;
}

const Pagination : React.FC<PaginationProps> = ({postsPerPage, totalPosts, paginate, currentPage}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.container}>
            {pageNumbers.map((number) => (
                <div onClick={() => paginate(number)} className={`${styles.pageItem} ${currentPage === number ? styles.selectedPageItem : ''}`} >
                    {number}
                </div>
            ))}
        </div>
    )
}

export default Pagination;