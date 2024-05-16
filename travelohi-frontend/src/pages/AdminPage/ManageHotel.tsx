/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import InputTextField from "../../components/InputTextField/InputTextField";
import contentStyle from "./AdminContent.module.scss";
import {
  Hotel,
  RoomCategory,
  availableFacilities,
  roomFacilities,
} from "../../models/Hotel";
import FormLabel from "../../components/FormLabel/FormLabel";
import RatingField from "../../components/RatingField/RatingField";
import styles from "./ManageHotel.module.scss";
import ImageUploadField from "../../components/ImageUploadField/ImageUploadField";
import Image from "../../components/Image/Image";
import Button from "../../components/Button/Button";
import { FaPlus, FaTrash, FaHotel } from "react-icons/fa";
import { City } from "../../models/City";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebaseConfig";

const ManageHotel = () => {
  const [hotel, setHotel] = useState<Hotel>({
    ID: 0,
    name: "",
    description: "",
    address: "",
    overall_rating: 0,
    cleanliness_rating: 0,
    comfort_rating: 0,
    location_rating: 0,
    service_rating: 0,
    facilities: [],
    room_categories: [],
    reviews: [],
    picture_urls: [],
    city_id: 0,
  });

  const toggleFacility = (facility: string) => {
    setHotel((prevHotel) => ({
      ...prevHotel,
      facilities: prevHotel.facilities.includes(facility)
        ? prevHotel.facilities.filter((f) => f !== facility)
        : [...prevHotel.facilities, facility],
    }));
  };

  const toggleRoomFacility = (roomIndex: number, facility: string) => {
    setRoomCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category, index) => {
        if (index === roomIndex) {
          const isFacilityPresent = category.facilities.includes(facility);
          return {
            ...category,
            facilities: isFacilityPresent
              ? category.facilities.filter((f) => f !== facility)
              : [...category.facilities, facility],
          };
        }
        return category;
      });

      return updatedCategories;
    });
  };

  const [hotelImages, setHotelImages] = useState<File[]>([]);
  const imageUrls = hotelImages?.map((file) => URL.createObjectURL(file));

  const handleImageChange = (image: File) => {
    console.log("image is inserted to the HOTEL IMAGES");
    setHotelImages((prevImages) => {
      const updatedImages = prevImages ? [...prevImages] : [];
      updatedImages.push(image);
      return updatedImages;
    });
  };

  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

  const handleRoomCategoryChange = (
    index: number,
    field: keyof RoomCategory,
    value: any
  ) => {
    const updatedRoomCategories = [...roomCategories];
    updatedRoomCategories[index] = {
      ...updatedRoomCategories[index],
      [field]: value,
    };
    setRoomCategories(updatedRoomCategories);
  };

  const addRoomCategory = () => {
    setRoomCategories([
      ...roomCategories,
      {
        id: 0,
        hotel_id: hotel.ID,
        category_name: "",
        price: 0,
        facilities: [],
        picture_urls: [],
      },
    ]);
  };

  const [roomImages, setRoomImages] = useState<File[][]>([]);

  const handleImageRoomChange = (index: number, image: File) => {
    setRoomImages((prevImages) => {
      const updatedImages = [...prevImages];

      // Check if there's already an array for this room category
      if (updatedImages[index]) {
        // If so, add the new image to it
        updatedImages[index] = [...updatedImages[index], image];
      } else {
        // Otherwise, create a new array for this category with the image
        updatedImages[index] = [image];
      }

      return updatedImages;
    });
    const imageUrl = URL.createObjectURL(image);

    setRoomCategories((prevCategories) => {
      return prevCategories.map((category, idx) => {
        if (idx === index) {
          const updatedPictures = [...category.picture_urls, imageUrl];
          return { ...category, picture_urls: updatedPictures };
        }
        return category;
      });
    });
  };

  const removeRoomCategory = (index: number) => {
    setRoomCategories(roomCategories.filter((_, i) => i !== index));
  };

  // useEffect(() => {
  //   console.log(hotel)
  // }, [hotel])

  const [availableCities, setAvailableCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch("http://127.0.0.1:3000/api/city/get");

      if (!response.ok) {
        console.error("Failed to fetch promos:", response.statusText);
        return;
      }

      const data = await response.json();
      setAvailableCities(data);
    };

    fetchCities();
  }, []);

  const handleCityChange = (selectedCity: number) => {
    setHotel((prevHotel) => ({
      ...prevHotel,
      city_id: selectedCity,
    }));
  };

  const uploadImageToFirebase = async (imageFile: File, folderPath: string) => {
    const timestamp = new Date().getTime(); 
    const randomizedFileName = `${timestamp}-${imageFile.name}`;

    const storageRef = ref(storage, `${folderPath}/${randomizedFileName}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async () => {
    console.log(roomImages);
    // First, handle image uploads for hotel images
    const hotelImageUploadPromises = hotelImages.map((imageFile) =>
      uploadImageToFirebase(imageFile, "hotel_images")
    );
    const hotelImageUrls = await Promise.all(hotelImageUploadPromises);

    const roomImageUploadPromises = roomImages.map((categoryImages) =>
      Promise.all(
        categoryImages.map((imageFile) =>
          uploadImageToFirebase(imageFile, "room_images")
        )
      )
    );

    const roomImageUrls = await Promise.all(roomImageUploadPromises);

    // Update your hotel and room data with the new URLs
    const updatedHotel = {
      ...hotel,
      overall_rating:
        (hotel.cleanliness_rating +
          hotel.comfort_rating +
          hotel.service_rating +
          hotel.location_rating) /
        4,
      picture_urls: hotelImageUrls,
      room_categories: roomCategories.map((category, idx) => ({
        ...category,
        picture_urls: roomImageUrls[idx] || [],
      })),
    };

    try {
      const response = await fetch("http://127.0.0.1:3000/api/hotel/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHotel),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        // Clear the data
        setHotel({
          ID: 0,
          name: "",
          description: "",
          address: "",
          overall_rating: 0,
          cleanliness_rating: 0,
          comfort_rating: 0,
          location_rating: 0,
          service_rating: 0,
          facilities: [],
          room_categories: [],
          reviews: [],
          picture_urls: [],
          city_id: 0,
        });
        setHotelImages([]);
        setRoomCategories([]);
        setRoomImages([]);

        alert("Succesfully created  hotel!");
      } else {
        console.error("Hotel Creation failed:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hotelContainer}>
        <div className={contentStyle.container}>
          <Header>Create Hotel</Header>
          <div className={contentStyle.columnContainer}>
            <div className={contentStyle.formContainer}>
              <div className={contentStyle.fieldContainer}>
                <InputTextField
                  label="Name"
                  setValue={(name: string) =>
                    setHotel((prevHotel) => ({
                      ...prevHotel,
                      name: name,
                    }))
                  }
                  value={hotel.name}
                />
              </div>
              <div className={contentStyle.fieldContainer}>
                <FormLabel size={"sm"} text={"City"} />
                <select
                  value={hotel.city_id}
                  onChange={(e) => handleCityChange(Number(e.target.value))}
                  className={contentStyle.selector}
                >
                  <option value="">Select a city</option>
                  {availableCities.map((city) => (
                    <option key={city.ID} value={city.ID}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={contentStyle.fieldContainer}>
                <InputTextField
                  label="Address"
                  setValue={(address: string) =>
                    setHotel((prevHotel) => ({
                      ...prevHotel,
                      address: address,
                    }))
                  }
                  value={hotel.address}
                />
              </div>
              <div className={`${contentStyle.fieldContainer} mb-10`}>
                <FormLabel size={"sm"} text={"Description"} />
                <textarea
                  id="description"
                  className={contentStyle.textArea}
                  value={hotel.description}
                  onChange={(e) =>
                    setHotel((prevHotel) => ({
                      ...prevHotel,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.ratingAndFacilities}>
                <div className={contentStyle.formContainer}>
                  <div className={`${contentStyle.fieldContainer} mb-10`}>
                    <FormLabel size={"sm"} text={"Cleanliness Rating"} />
                    <RatingField
                      setValue={(rating: number) =>
                        setHotel((prevHotel) => ({
                          ...prevHotel,
                          cleanliness_rating: rating,
                        }))
                      }
                      value={hotel.cleanliness_rating}
                    />
                  </div>
                  <div className={`${contentStyle.fieldContainer} mb-10`}>
                    <FormLabel size={"sm"} text={"Comfort Rating"} />
                    <RatingField
                      setValue={(rating: number) =>
                        setHotel((prevHotel) => ({
                          ...prevHotel,
                          location_rating: rating,
                        }))
                      }
                      value={hotel.location_rating}
                    />
                  </div>
                  <div className={`${contentStyle.fieldContainer} mb-10`}>
                    <FormLabel size={"sm"} text={"Location Rating"} />
                    <RatingField
                      setValue={(rating: number) =>
                        setHotel((prevHotel) => ({
                          ...prevHotel,
                          comfort_rating: rating,
                        }))
                      }
                      value={hotel.comfort_rating}
                    />
                  </div>
                  <div className={`${contentStyle.fieldContainer} mb-10`}>
                    <FormLabel size={"sm"} text={"Service Rating"} />
                    <RatingField
                      setValue={(rating: number) =>
                        setHotel((prevHotel) => ({
                          ...prevHotel,
                          service_rating: rating,
                        }))
                      }
                      value={hotel.service_rating}
                    />
                  </div>
                </div>
                <div className={contentStyle.formContainer}>
                  <div className={`text-lg font-weight-600 mb-10`}>
                    Facilities
                  </div>
                  <div className={styles.facilityList}>
                    {availableFacilities.map((facility) => (
                      <div key={facility}>
                        <input
                          type="checkbox"
                          id={facility}
                          checked={hotel.facilities.includes(facility)}
                          onChange={() => toggleFacility(facility)}
                        />
                        <label htmlFor={facility}>{facility}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.formContainer}>
                <div className={`text-lg font-weight-600 mt-10`}>
                  Upload Hotel Images
                </div>
                <div className={contentStyle.uploadImagesContainer}>
                  {imageUrls?.map((url, index) => (
                    <Image
                      imageUrl={url}
                      width="15vw"
                      height="18vh"
                      alt={`Hotel Image ${index + 1}`}
                    />
                  ))}
                </div>
                <ImageUploadField
                  id="image-hotel"
                  setImage={handleImageChange}
                />
              </div>
              <div className={contentStyle.buttonContainer}>
                <Button onClick={addRoomCategory} width="35%" outlined>
                  <FaPlus />
                  Add Room Type
                </Button>
                <Button onClick={handleSubmit} width="30%" primary>
                  <FaHotel />
                  Create Hotel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.roomContainer}>
        {roomCategories.map((category, index) => (
          <div className={contentStyle.container} key={index}>
            <Header>Room Type {index + 1}</Header>
            <div className={contentStyle.fieldContainer}>
              <InputTextField
                label="Category Name"
                value={category.category_name}
                setValue={(value) =>
                  handleRoomCategoryChange(index, "category_name", value)
                }
              />
            </div>
            <div className={contentStyle.fieldContainer}>
              <InputTextField
                label="Price"
                type="number"
                setValue={(value) =>
                  handleRoomCategoryChange(index, "price", parseFloat(value))
                }
              />
            </div>
            <div className="text-lg font-weight-600">Facilities</div>
            <div className={styles.facilityList}>
              {roomFacilities.map((facility) => (
                <div key={facility}>
                  <input
                    type="checkbox"
                    id={`${facility}-${index}`}
                    checked={category.facilities.includes(facility)}
                    onChange={() => toggleRoomFacility(index, facility)}
                  />
                  <label htmlFor={`${facility}-${index}`}>{facility}</label>
                </div>
              ))}
            </div>
            <div className={styles.formContainer}>
              <div className={`text-lg font-weight-600 mt-10`}>
                Upload Room Images
              </div>
              <div className={contentStyle.uploadImagesContainer}>
                {category.picture_urls?.map((url, index) => (
                  <Image
                    imageUrl={url}
                    width="15vw"
                    height="18vh"
                    alt={`Hotel Image ${index + 1}`}
                  />
                ))}
              </div>
              <ImageUploadField
                id={`image-room-${index}`}
                setImage={(image) => handleImageRoomChange(index, image)}
              />
            </div>
            <Button outlined onClick={() => removeRoomCategory(index)}>
              <FaTrash />
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageHotel;
