import { useState, ChangeEvent, FormEvent } from "react";
import "./PredictPage.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import BackgroundImage from "../../components/BackgroundImage/BackgroundImage";
import BackgroundIllustration from "../../assets/traveloka-home.jpg";
import styles from "./PredictPage.module.scss";
import { useNavigate } from "react-router-dom";

interface PredictionResponse {
  class: string;
  confidence: number;
}

const PredictPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // Added state for file name
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name); // Update the file name state
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = (await response.json()) as PredictionResponse;
      setPrediction(result);

      navigate(`/search/hotel/predict?query=${encodeURIComponent(result.class)}`);
    } catch (error) {
      console.error("Error during file upload!", error);
    }
  };

  return (
    <>
      <Navbar />
      <BackgroundImage imageUrl={BackgroundIllustration}>
        <div className={styles.fileUploadContainer}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={styles.customFileInput}
            />
            <div className={`${styles.fileNameContainer}`}>
              {
              fileName ? 
                <div className={styles.fileName}>{fileName}</div> :
                <div className={styles.fileIndicatorContainer}>
                  <div className={styles.fileUploadText}>Drag and Drop image here</div>
                </div>
              }
              <label htmlFor="fileInput" className={styles.uploadButton}>
                Choose File
              </label>
            </div>
            <div className={styles.buttonsContainer}>
              <button
                className={`${styles.predictButton} button-blue font-weight-600 text-lg rounded-15`}
                type="submit"
              >
                Hotel Predict
              </button>
            </div>
          </form>
          {prediction && (
            <div className="prediction-result">
              <p>Class: {prediction.class}</p>
              <p>Confidence: {prediction.confidence.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </BackgroundImage>
    </>
  );
};

export default PredictPage;
