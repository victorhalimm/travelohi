import ImagePanel from "../../components/ImagePanel/ImagePanel";
import TravelIllustration from "../../assets/traveloka-illustration.jpg";
import Divider from "../../components/Divider/Divider";
import FormLabel from "../../components/FormLabel/FormLabel";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./components.module.scss";
import ForgotPassword from "./ForgotPassword";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
import ReCAPTCHA from "react-google-recaptcha";

interface OtpLoginProps {
  isOtpSent: boolean;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  handleOtpLogin: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  setEmailOtp: React.Dispatch<React.SetStateAction<string>>;
  emailOtp: string;
  setShowOtpForm: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendOtp: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  otp: string;
}

const OtpLogin: React.FC<OtpLoginProps> = ({
  isOtpSent,
  setOtp,
  handleOtpLogin,
  setEmailOtp,
  emailOtp,
  setShowOtpForm,
  handleSendOtp,
  otp,
}) => {
  return isOtpSent ? (
    <>
      <div className="mb-2rem">
        <FormLabel size="sm" text="OTP" />
        <input
          type="text"
          id="otp"
          value={otp}
          className="w-full p-10 rounded-5 thin-border"
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full button-blue text-white p-10 rounded-5 clickable"
        onClick={handleOtpLogin}
      >
        Login with OTP
      </button>
    </>
  ) : (
    <>
      <div className="mb-2rem">
        <FormLabel size="sm" text="Email" />
        <input
          type="email"
          value={emailOtp}
          id="email"
          className="w-full p-10 rounded-5 thin-border"
          onChange={(e) => setEmailOtp(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full button-blue text-white p-10 rounded-5 clickable"
        onClick={handleSendOtp}
      >
        Send OTP
      </button>
      <button
        type="button"
        className="w-full button-white outline-1 text-black thin-border p-10 rounded-5 clickable"
        onClick={() => setShowOtpForm(false)}
      >
        Back to Login
      </button>
    </>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const navigate = useNavigate();
  const [isForgotPw, setForgotPw] = useState(false);

  const [isRecaptcha, setRecaptcha] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const onRecaptchaChange = () => {
    setRecaptcha(true)
  }

  const handleSendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3000/api/login/sendotp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOtp,
        }),
      });

      if (response.ok) {
        // Handle successful login
        const data = await response.json();
        console.log(data);
        setIsLoading(false);
      } else {
        console.error("Login failed:", response.status);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setIsOtpSent(true);
  };

  const handleOtpLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/api/login/otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOtp,
          otp: otp,
        }),
      });

      if (response.ok) {
        // Handle successful login
        const data = await response.json();
        console.log(data);
        setIsLoading(false);

        navigate('/home');
      } else {
        console.error("Login failed:", response.status);
        alert("Invalid OTP");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!isRecaptcha) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        console.log(data);

        navigate("/home");
      } else {
        console.error("Login failed:", response.status);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex w-full bg-blue-400">
      {isLoading && <LoadingBar />}
      <ImagePanel src={TravelIllustration} />
      <div className="flex flex-column justify-center h-vfull w-1of2 bg-white">
        <form className="content-padding flex flex-column gap-5">
          <PageHeader text="Log in" />
          {isForgotPw ? (
            <ForgotPassword setIsForgot={setForgotPw} />
          ) : !showOtpForm ? (
            <>
              <div className="mb-1rem">
                <FormLabel size="sm" text="Email" />
                <input
                  type="email"
                  id="email"
                  className="w-full p-10 rounded-5 thin-border"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-1rem">
                <FormLabel size="sm" text="Password" />
                <input
                  type="password"
                  id="password"
                  className="w-full p-10 rounded-5 thin-border"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-1rem">
                <ReCAPTCHA sitekey="6LewAYMpAAAAAChR1hgEFAdi-KhVCcT3z852SUan" onChange={onRecaptchaChange} />
              </div>
              <div className="mb-1rem">
                <div className="text-sm font-weight-500">
                  <button
                    className="text-blue-500 clear-style"
                    onClick={() => setForgotPw(true)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Forget Password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full button-blue text-white p-10 rounded-5 clickable"
                onClick={(e) => handleLogin(e)}
              >
                Login
              </button>
              <Divider text="OR"></Divider>
              <div className="mb-1rem">
                <button
                  type="submit"
                  className="w-full button-white outline-1 text-black thin-border p-10 rounded-5 clickable"
                  onClick={() => setShowOtpForm(true)}
                >
                  Login with OTP
                </button>
              </div>
              <div className="mb-1rem">
                <button
                  type="submit"
                  className="w-full button-blue outline-1 text-black thin-border p-10 rounded-5 clickable"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </div>
            </>
          ) : (
            <OtpLogin
              isOtpSent={isOtpSent}
              setOtp={setOtp}
              handleOtpLogin={handleOtpLogin}
              setEmailOtp={setEmailOtp}
              emailOtp={emailOtp}
              setShowOtpForm={setShowOtpForm}
              handleSendOtp={handleSendOtp}
              otp={otp}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
