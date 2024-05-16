import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormLabel from "../../components/FormLabel/FormLabel";
import PageHeader from "../../components/PageHeader/PageHeader";
import ImagePanel from "../../components/ImagePanel/ImagePanel";
import RegisterIllust from "../../assets/traveloka-illustration.jpg";

import "./RegisterPage.scss";
import InputTextField from "../../components/InputTextField/InputTextField";
import InformationModal from "../../components/Modal/InformationModal";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterForm = () => {
  interface SecurityQuestion {
    qid: string;
    question: string;
  }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    gender: "",
    dob: "",
    name: "",
    confirmPw: "",
  });
  const [securityQuestion, setSecurityQuestion] = useState<SecurityQuestion>();
  const [securityQuestionId, setSecurityQuestionId] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  const securityQuestions = [
    {
      question: "What is your favorite childhood pet's name?",
      qid: "Q001",
    },
    {
      question: "In which city where you born?",
      qid: "Q002",
    },
    {
      question: "What is the name of your favorite book or movie?",
      qid: "Q003",
    },
    {
      question: "What is the name of the elementary school you attended?",
      qid: "Q004",
    },
    {
      question: "What is the model of your first car?",
      qid: "Q005",
    },
  ];

  // Regex for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [passwordConditions, setPasswordConditions] = useState({
    alphanumeric: false,
    length: false,
    specialChar: false,
  });

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateName = () => {
    const nameRegex = /^[A-Za-z ]+$/;

    if (!firstName || !lastName) {
      setErrors((prev) => ({
        ...prev,
        name: "First and Last name is required",
      }));
      return false;
    } else {
      if (firstName.trim().length <= 5 || lastName.trim().length <= 5) {
        setErrors((prev) => ({
          ...prev,
          name: "First and Last name have to be more than 5 characters",
        }));
        return false;
      }

      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        setErrors((prev) => ({
          ...prev,
          name: "First and Last name should not contain special characters",
        }));
        return false;
      }
    }

    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validatePassword = () => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const alphanumeric = hasLetter && hasNumber;

    const length = password.length >= 8 && password.length <= 30;

    const specialCharRegex = /[^a-zA-Z0-9]/;
    const specialChar = specialCharRegex.test(password);

    setPasswordConditions({ alphanumeric, length, specialChar });

    return alphanumeric && length && specialChar;
  };

  const validateGender = () => {
    if (!gender) {
      setErrors((prev) => ({ ...prev, gender: "Gender must be chosen" }));
      return false;
    }

    setErrors((prev) => ({ ...prev, gender: "" }));
    return true;
  };

  const validateConfirmPw = () => {
    if (confirmPassword !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPw: "Confirm password must be identic to password field",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, confirmPw: "" }));
    return true;
  };

  const validateDOB = () => {
    const currentDate = new Date();
    const birthDate = new Date(dob);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setErrors((prev) => ({
        ...prev,
        dob: "You must be at least 13 years old",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, dob: "" }));
      return true;
    }
  };

  const handleRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPwValid = validateConfirmPw();
    const isGenderValid = validateGender();
    const isDOBValid = validateDOB();

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPwValid &&
      isGenderValid &&
      isDOBValid && isRecaptcha
    ) {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/register", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            dob: dob,
            question_id: securityQuestionId,
            answer: securityAnswer,
          }),
        });

        if (response.ok) {
          // Handle successful login
          const data = await response.json();
          console.log(data);
          setModalMessage(
            "Registration Successful! A confirmation email has been sent."
          );
          setShowModal(true);
          setModalStatus(true);
        } else {
          console.error("Login failed:", response.status);
          setModalMessage("Registration Failed. Please try again.");
          setShowModal(true);
          setModalStatus(false);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else console.log("YOOO WTF");
  };

  const handleChangeOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQID = e.target.value;
    setSecurityQuestionId(selectedQID);
    const selectedQuestion = securityQuestions.find(
      (q) => q.qid === selectedQID
    );
    if (selectedQuestion) {
      setSecurityQuestion(selectedQuestion);
    } else setSecurityQuestion(undefined);
  };

  const [isRecaptcha, setRecaptcha] = useState(false);

  const onRecaptchaChange = () => {
    setRecaptcha(true)
  }

  return (
    <div className="flex w-full bg-blue-400 h-full">
      <ImagePanel src={RegisterIllust}></ImagePanel>
      <div className="content-padding flex flex-column justify-center h-full w-1of2 bg-white">
        <form className="flex flex-column gap-5">
          <PageHeader text="Register" />
          <div className="flex mb-1rem">
            <div className="name-form">
              <FormLabel text="First Name" />
              <input
                type="text"
                id="firstName"
                className="w-full p-10 rounded-5 thin-border"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="name-form">
              <FormLabel text="Last Name" />
              <input
                type="text"
                id="lastName"
                className="w-full p-10 rounded-5 thin-border"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          {errors.name && (
            <div className="error-message text-sm">{errors.name}</div>
          )}
          <InputTextField label="Email" setValue={setEmail} />
          {errors.email && (
            <div className="error-message text-sm">{errors.email}</div>
          )}
          <div className="mb-1rem">
            <FormLabel text="Date of Birth" />
            <input
              type="date"
              id="dob"
              className="w-full p-10 rounded-5 thin-border"
              onChange={(e) => setDob(e.target.value)}
            />
            {errors.dob && <div className="error-message">{errors.dob}</div>}
          </div>
          <div className="mb-1rem">
            <FormLabel text="Password" />
            <input
              type="password"
              id="password"
              className="w-full p-10 rounded-5 thin-border"
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword();
              }}
            />
          </div>
          {password && (
            <div className="flex flex-column">
              <div
                className={
                  passwordConditions.alphanumeric
                    ? "pblock-5 success-message text-sm"
                    : "pblock-5 error-message text-sm"
                }
              >
                Must consists of alphanumeric character
              </div>
              <div
                className={
                  passwordConditions.length
                    ? "pblock-5 success-message text-sm"
                    : "pblock-5 error-message text-sm"
                }
              >
                Must be more than 8 characters
              </div>
              <div
                className={
                  passwordConditions.specialChar
                    ? "pblock-5 success-message text-sm"
                    : "pblock-5 error-message text-sm"
                }
              >
                Must consists of one or more special characters
              </div>
            </div>
          )}
          <div className="mb-1rem">
            <FormLabel text="Confirm Password" />
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-10 rounded-5 thin-border"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPw && (
              <div className="error-message text-sm">{errors.confirmPw}</div>
            )}
          </div>
          <div className="mb-1rem">
            <FormLabel text="Gender" />
            <select
              id="gender"
              className="w-full p-10 rounded-5 thin-border"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <div className="error-message text-sm">{errors.gender}</div>
            )}
          </div>
          <div className="mb-1rem">
            <FormLabel text="Security Question" />
            <select
              id="securityQuestion"
              className="w-full p-10 rounded-5 thin-border"
              value={securityQuestionId}
              onChange={handleChangeOption}
            >
              <option value="">Select a Security Question</option>
              {securityQuestions.map((question, index) => (
                <option key={index} value={question.qid}>
                  {question.question}
                </option>
              ))}
            </select>
          </div>
          {securityQuestion && (
            <InputTextField label="Answer" setValue={setSecurityAnswer} />
          )}
          <div className="newsletter-checkbox mb-1rem">
            <input
              type="checkbox"
              id="newsletter"
              checked={subscribeToNewsletter}
              onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
            />
            <label htmlFor="newsletter" className="ml-10 text-sm">
              Subscribe to our newsletter
            </label>
          </div>

          <div className="mb-1rem">
            <ReCAPTCHA sitekey="6LewAYMpAAAAAChR1hgEFAdi-KhVCcT3z852SUan" onChange={onRecaptchaChange} />
          </div>

          <div className="mb-1rem">
            <div className="text-md font-weight-500">
              Already have an account?
              <Link to="/login" className="text-blue-500 clear-style">
                {" "}
                Login Now
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full button-blue text-white p-10 rounded-5 clickable"
            onClick={handleRegister}
          >
            Register Now
          </button>
        </form>
      </div>
      <InformationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
        success={modalStatus}
      />
    </div>
  );
};

export default RegisterForm;
