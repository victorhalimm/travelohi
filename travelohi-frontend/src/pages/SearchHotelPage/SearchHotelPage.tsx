import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./SearchHotelPage.module.scss";
import HotelSearchCard from "../../components/HotelSearchCard/HotelSearchCard";
import { useEffect, useState } from "react";
import { Hotel } from "../../models/Hotel";
import HotelFilter, { Filter } from "./HotelFilter";
import Pagination from "../../components/Pagination/Pagination";
import Footer from "../../components/Footer/Footer";

const SearchHotelPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [hotels, setHotels] = useState<Hotel[]>([]);

  const fetchHotels = async (name: string) => {
    if (!name) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/hotel/search?q=${encodeURIComponent(name)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const hotelsWithRoomCategories = await Promise.all(
        data.map(async (hotel: Hotel) => {
          const roomResponse = await fetch(
            `http://127.0.0.1:3000/api/hotel/category/${hotel.ID}`
          );
          if (!roomResponse.ok)
            throw new Error("Failed to fetch room categories");

          const roomCategories = await roomResponse.json();
          return { ...hotel, room_categories: roomCategories };
        })
      );

      setHotels(hotelsWithRoomCategories);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
  };

  useEffect(() => {
    fetchHotels(query?.toString() || "");
  }, []);

  const [filter, setFilter] = useState<Filter>({
    ratingMin: 0,
    ratingMax: 5,
    priceMin: 0,
    priceMax: 99999999,
    facilities: [],
  });

  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels);

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);

    console.log(hotels);
    const filtered = hotels?.filter((hotel) => {
      const isRatingMatch =
        hotel?.overall_rating >= newFilter.ratingMin &&
        hotel?.overall_rating <= newFilter.ratingMax &&
        hotel?.room_categories[0].price >= newFilter.priceMin &&
        hotel?.room_categories[0].price <= newFilter.priceMax;

      const isFacilitiesMatch =
        !newFilter.facilities ||
        newFilter.facilities.length === 0 ||
        newFilter.facilities.every((facility) =>
          hotel.facilities.includes(facility)
        );

      return isRatingMatch && isFacilitiesMatch;
    });
    setFilteredHotels(filtered ? filtered : []);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [resultsPerPage, setResultsPerPage] = useState(2);
  const lastResultIdx = currentPage * resultsPerPage;
  const firstResultIdx = lastResultIdx - resultsPerPage;

  const hotelsInPage = filteredHotels?.slice(firstResultIdx, lastResultIdx);

  const paginate = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className="text-lg font-weight-600">
          Displaying results for: {query}
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.filterMenu}>
            <HotelFilter onFilterChange={handleFilterChange} />
          </div>
          <div className={styles.searchResults}>
            {hotelsInPage?.map((hotel) => {
              return <HotelSearchCard hotel={hotel} />;
            })}
            <div className={styles.paginationContainer}>
              <Pagination
                paginate={paginate}
                currentPage={currentPage}
                postsPerPage={resultsPerPage}
                totalPosts={filteredHotels.length}
              ></Pagination>
              <div className={styles.resultsPerPageDropdown}>
                <label className="text-md font-weight-500" htmlFor="resultsPerPage">Results per page:</label>
                <select
                  id="resultsPerPage"
                  value={resultsPerPage}
                  onChange={(e) => setResultsPerPage(Number(e.target.value))}
                  className={styles.upwardDropdown}
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchHotelPage;
