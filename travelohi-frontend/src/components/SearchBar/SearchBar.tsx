import styles from './SearchBar.module.scss'

interface SearchBarProps {
    onChange: (value: string) => void;
    placeholder?: string;
    value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange, placeholder = "", value }) => {
    return (
        <div className="w-full">
            <input
                className={` p-10 outline-0 rounded-10 ${styles.searchBar}`}
                type="text"
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value ? value : undefined}
            />
        </div>
    );
};

export default SearchBar;