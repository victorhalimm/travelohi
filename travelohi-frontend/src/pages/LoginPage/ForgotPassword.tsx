import React, { useState } from "react";
import InputTextField from "../../components/InputTextField/InputTextField";
import LoadingBar from "../../components/LoadingBar/LoadingBar";

interface Props {
  setIsForgot(isForgot: boolean): void;
}

interface AnswerQuestionProp {
  question: string;
  setAnswer(answer: string): void;
  handleSubmitAnswer(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

interface ChangePasswordProp {
  setPassword(pw: string): void;
  setConfirmPw(pw: string): void;
  handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  handlePasswordChange(e : React.ChangeEvent<HTMLInputElement>): void;
  password : string;
  passwordConditions : PasswordCondition;
  errors: { confirmPw?: string };
}

interface PasswordCondition {
  alphanumeric: boolean,
  length: boolean,
  specialChar: boolean,
}

const AnswerQuestion: React.FC<AnswerQuestionProp> = ({
  question,
  setAnswer,
  handleSubmitAnswer,
}) => {
  return (
    <div className="flex flex-column gap-20">
      <div className="text-md font-weight-400">
        Answer the provided question to proceed to change password!
      </div>
      <div className="flex flex-column gap-10">
        <div className="text-md font-weight-600">{question}</div>
        <InputTextField label="" setValue={setAnswer} />
        <div className="mb-1rem">
          <button
            type="submit"
            className="w-full button-blue outline-1 text-black thin-border p-10 rounded-5 clickable"
            onClick={(e) => handleSubmitAnswer(e)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangePassword: React.FC<ChangePasswordProp> = ({
  handleSubmit,
  setConfirmPw,
  setPassword,
  passwordConditions,
  password,
  handlePasswordChange,
  errors
}) => {


  return (
    <>
      <InputTextField handlePasswordChange={handlePasswordChange} type="password" label="New Password" setValue={setPassword} />
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
      <InputTextField type="password" label="Confirm New Password" setValue={setConfirmPw} error={errors.confirmPw}/>
      <button className="button-blue outline-1 text-black thin-border p-10 rounded-5 clickable" onClick={handleSubmit}>Change Password</button>
    </>
  );
};

const ForgotPassword: React.FC<Props> = ({ setIsForgot }) => {
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    confirmPw : ""
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [question, setQuestion] = useState<string>();

  const [answer, setAnswer] = useState<string>();

  const [isAnswerCorrect, setAnswerCorrect] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");

  const [passwordConfirmation, setPasswordConfirmation] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  
  const [passwordConditions, setPasswordConditions] = useState({
    alphanumeric: false,
    length: false,
    specialChar: false,
  });

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

  const validateConfirmPw = () => {
    if (passwordConfirmation !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPw: "Confirm password must be identic to password field",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, confirmPw: "" }));
    return true;
  };


  const handleSubmitForgot = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    if (validateEmail()) {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/forgot/question",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (response.ok) {
          setIsLoading(false);
          const data = await response.json();
          console.log(data);
          setQuestion(data.question);
        } else {
          setIsLoading(false);
          console.error("Login failed:", response.status);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  const handleSubmitAnswer = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3000/api/forgot/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, email }),
      });

      if (response.ok) {
        setIsLoading(false);
        const data = await response.json();
        console.log(data);
        setAnswerCorrect(true);
      } else {
        setIsLoading(false);
        console.error("Check Answer failed:", response.status);
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handlePwChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword();
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setIsLoading(true);

    const isPwValid  = validatePassword();
    const isSameConfirm = validateConfirmPw();

    if (isPwValid && isSameConfirm) {
      console.log(email, password);
      try {
        const response = await fetch("http://127.0.0.1:3000/api/forgot/change", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password}),
        });

        if (response.ok) {
          setIsLoading(false);
          const data = await response.json();
          console.log(data);
          setAnswerCorrect(true);
        } else {
          setIsLoading(false);
          console.error("Check Answer failed:", response.status);
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }

  }

  return (
    <div className="flex flex-column justify-center gap-5">
      {isLoading && <LoadingBar />}
      {!question ? (
        <>
          <div className="font-weight-600 text-sm">
            Provide your Email Address
          </div>
          <InputTextField setValue={setEmail} label="" />

          <div className="mb-1rem">
            <button
              type="submit"
              className="w-full button-blue outline-1 text-black thin-border p-10 rounded-5 clickable"
              onClick={(e) => handleSubmitForgot(e)}
            >
              Check Email
            </button>
          </div>

          <div className="mb-1rem">
            <button
              type="submit"
              className="w-full button-white outline-1 text-black thin-border p-10 rounded-5 clickable"
              onClick={() => setIsForgot(false)}
            >
              Back To Login
            </button>
          </div>
        </>
      ) : !isAnswerCorrect ? (
        <AnswerQuestion setAnswer={setAnswer} question={question} handleSubmitAnswer={handleSubmitAnswer} />
      ) : (
        <>
          <ChangePassword errors={errors} handlePasswordChange={handlePwChange} password={password} setPassword={setPassword} setConfirmPw={setPasswordConfirmation} handleSubmit={handleSubmit} passwordConditions={passwordConditions}/>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
