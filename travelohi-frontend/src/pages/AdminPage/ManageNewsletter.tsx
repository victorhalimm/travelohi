import { useState } from "react";
import Header from "../../components/Header/Header";
import InputTextField from "../../components/InputTextField/InputTextField";
import styles from "./ManageNewsletter.module.scss";
import TextArea from "../../components/InputTextField/TextArea";
import Button from "../../components/Button/Button";

const ManageNewsletter = () => {
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");

  const handleSendNewsletter = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/user/send-newsletter",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            header: emailSubject,
            content: emailContent,
          }),
        }
      );
      if (!response.ok) throw new Error(await response.json());
      alert("Newsletter sent successfully!");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Header>Manage Newsletter</Header>
      <div className={styles.formContainer}>
        <InputTextField label="Subject" setValue={setEmailSubject} />
        <TextArea setValue={setEmailContent} label="Content" />
        <Button onClick={handleSendNewsletter} primary>Send Newsletter</Button>
      </div>
    </div>
  );
};

export default ManageNewsletter;
