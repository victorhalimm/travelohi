import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import InputTextField from "../../components/InputTextField/InputTextField";
import ImageUploadField from "../../components/ImageUploadField/ImageUploadField";
import PromoCard from "../../components/PromoCard/PromoCard";
import contentStyle from "./AdminContent.module.scss";
import Button from "../../components/Button/Button";
import { storage } from "../../firebase/firebaseConfig"; // Import your Firebase storage reference
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Promo } from "../../models/Promo";
import styles from "./ManagePromo.module.scss";
import { FaPlus } from "react-icons/fa";

const ManagePromotion = () => {
  const [promotionName, setPromotionName] = useState<string>("");
  const [promotionCode, setPromotionCode] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [isPreview, setPreview] = useState<boolean | null | string>(false);
  const [promoType, setPromoType] = useState<string>("Airline");

  // Convert the uploaded image file to a URL
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    // If there's a file selected for upload, use that for the preview URL
    if (image) {
      const fileUrl = URL.createObjectURL(image);
      setImageUrl(fileUrl);

      // Clean up the object URL to avoid memory leaks
      return () => URL.revokeObjectURL(fileUrl);
    }
}, [image]);

  const uploadImageToFirebase = async (file: File | null) => {
    if (!file) return "";
    const storageRef = ref(storage, `promotion_picture/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  useEffect(() => {
    // Check if all fields are filled to enable the preview
    const allFieldsFilled =
      promotionName &&
      promotionCode &&
      discount &&
      (image || imageUrl) &&
      promoType &&
      expiryDate;

    setPreview(allFieldsFilled);
  }, [
    promotionName,
    promotionCode,
    discount,
    image,
    promoType,
    expiryDate,
    imageUrl,
  ]);

  const [promos, setPromos] = useState<Promo[]>([]);
  const [isCreate, setCreate] = useState<boolean>(false);
  const [isUpdate, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchPromos = async () => {
      const response = await fetch("http://127.0.0.1:3000/api/promo/get");

      if (!response.ok) {
        console.error("Failed to fetch promos:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setPromos(data);
    };

    fetchPromos();
  }, []);

  const PromoGrid = () => {
    return (
      <div className={styles.promoGridContainer}>
        {promos.map((promo) => (
          <PromoCard
            onClick={() => handlePromoSelect(promo)}
            width="20vw"
            height="30vh"
            {...promo}
          />
        ))}
      </div>
    );
  };

  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  const handlePromoSelect = (promo: Promo) => {
    setSelectedPromo(promo);
    setPromotionName(promo.name);
    setPromotionCode(promo.code);
    setDiscount(promo.discount.toString());
    setPromoType(promo.type);

    // So the date field can display the date appropriately
    const formattedExpiryDate = new Date(promo.expiry_date)
      .toISOString()
      .split("T")[0];
    setExpiryDate(formattedExpiryDate);
    setImage(null);
    setImageUrl(promo.image_url);

    setUpdate(true);
    setCreate(false);
  };

  const handleCreateMode = () => {
    setUpdate(false);
    setCreate(!isCreate);

    // Set all form's field to be empty
    setPromotionName("");
    setPromotionCode("");
    setDiscount("");
    setPromoType("Airline");
    setExpiryDate("");
    setImage(null);
    setSelectedPromo(null);
    setPreview(false);
  };

  const handleCreate = async () => {
    const imageUrl = await uploadImageToFirebase(image);
    const promoDetails = {
      name: promotionName,
      code: promotionCode,
      discount,
      type: promoType,
      expiry_date: expiryDate,
      image_url: imageUrl,
    };

    const response = await fetch("http://127.0.0.1:3000/api/promo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promoDetails),
    });

    if (!response.ok) {
      console.log(await response.json());
      alert("Failed to Create!");
    } else {
      // Handle success
      console.log(await response.json());
      alert("Successfully created Promotion!");
    }
  };

  const handleUpdate = async () => {
    const imageUrl = await uploadImageToFirebase(image);
    const promoDetails = {
      name: promotionName,
      code: promotionCode,
      discount: discount,
      type: promoType,
      expiry_date: expiryDate,
      image_url: imageUrl,
    };

    console.log(promoDetails)

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/promo/update/${selectedPromo?.ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(promoDetails),
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Failed to update promo");
      }

      const data = await response.json();

      console.log(data);
      alert("Promo updated successfully");
    } catch (error) {
      console.error("Error updating Promo:", error);
      alert("Error updating Promo");
    }
  };

  const handleSubmit = async () => {
    if (isCreate) handleCreate();
    else handleUpdate();
  };

  return (
    <div className={contentStyle.container}>
      <Header>Promo List</Header>
      <PromoGrid />
      <div className={contentStyle.buttonContainer}>
        <Button onClick={handleCreateMode} primary>
          <FaPlus />
          Add new promo
        </Button>
      </div>
      {(isCreate || isUpdate) && (
        <div className={contentStyle.columnContainer}>
          <div className={contentStyle.formContainer}>
            <div className={contentStyle.fieldContainer}>
              <InputTextField
                lblSize="sm"
                label="Name"
                setValue={setPromotionName}
                value={promotionName}
              />
            </div>
            <div className={contentStyle.fieldContainer}>
              <InputTextField
                lblSize="sm"
                label="Code"
                setValue={setPromotionCode}
                value={promotionCode}
              />
            </div>
            <div className={contentStyle.fieldContainer}>
              <InputTextField
                lblSize="sm"
                label="Discount"
                setValue={setDiscount}
                value={discount}
              />
            </div>
            <div
              className={contentStyle.fieldContainer}
              style={{ marginBottom: "10px" }}
            >
              <label htmlFor="promoType">Promotion Type</label>
              <select
                name="promoType"
                id="promoType"
                value={promoType}
                onChange={(e) =>
                  setPromoType(e.target.value as "Airline" | "Hotel")
                }
                className={contentStyle.selector}
              >
                <option value="airline">Airline</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
            <div
              className={contentStyle.fieldContainer}
              style={{ marginBottom: "10px" }}
            >
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={contentStyle.selector}
              />
            </div>
            <div className={contentStyle.fieldContainer}>
              <div className="text-lg font-weight-600">Upload Promotion's Image</div>
              <ImageUploadField id="image-promo" setImage={setImage} />
            </div>
          </div>
          <div
            className={`${contentStyle.formContainer} ${contentStyle.previewContainer}`}
          >
            {isPreview && (
              <>
                <Header>Preview</Header>
                {/* Render PromoCard with the inputted details */}
                <PromoCard
                  image_url={imageUrl ? imageUrl : ""}
                  discount={Number(discount)}
                  name={promotionName}
                  code={promotionCode}
                  type={promoType}
                  expiry_date={expiryDate}
                />
                <Button width="28%" primary onClick={handleSubmit}>
                  {isCreate && "Create Promo"}
                  {!isCreate && "Update Promo"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePromotion;
