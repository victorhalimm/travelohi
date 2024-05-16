import  { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./AccountSection.module.scss";
import SettingsField from "./SettingsField";
import { UserData } from "../../models/User";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const AccountSection = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("http://127.0.0.1:3000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        console.log(data);
        setUser(data);
        setIsNewsletter(data.newsletter)
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchImage = async () => {
      const storage = getStorage();
      const imageRef = ref(storage, `/profile_picture/${user.id}.png`);
      try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    fetchImage();
  }, [user?.id]); 

  const [isNewsletter, setIsNewsletter] = useState<boolean>(false);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }
  
  const fullName = `${user.first_name} ${user.last_name}`;


  const handleToggleNewsletter = (isNewsletter: boolean) => {
    const afterToggle = !isNewsletter;

    setIsNewsletter(afterToggle);

    if (afterToggle) handleEnableNewsletter();
    else handleDisableNewsletter();
  };

  const handleEnableNewsletter = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/user/newsletter/enable/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Failed to enable newsletter");
      }

      const data = await response.json();

      console.log(data);
      alert("Newsletter enabled successfully");
    } catch (error) {
      console.error("Error updating newsletter:", error);
      alert("Error updating newsletter");
    }
  };

  const handleDisableNewsletter = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/user/newsletter/disable/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Failed to disable newsletter");
      }

      const data = await response.json();

      console.log(data);
      alert("Newsletter disabled successfully");
    } catch (error) {
      console.error("Error updating newsletter:", error);
      alert("Error updating newsletter");
    }
  };

  return (
    <div className={styles.background}>
      <Header>User details</Header>
      <div className={styles.fieldContainer}>
        <SettingsField
          userId={user?.id}
          label="Full Name"
          content={fullName}
          isProfile
          img={imageUrl}
        />
        <SettingsField userId={user?.id} label="Email" content={user?.email} />
        <SettingsField
          userId={user?.id}
          label="Phone Number"
          content={user?.phone_number}
        />
        <SettingsField
          onClick={handleToggleNewsletter}
          content="Subscription to our Newsletter"
          isToggle
          toggleValue={isNewsletter}
        />
      </div>
      <Header>Credit Card's Information</Header>
      <div className={styles.fieldContainer}>
        <SettingsField content={user.credit_card.number} label="Credit Card" userId={user.id}></SettingsField>
      </div>
    </div>
  );
};

export default AccountSection;
