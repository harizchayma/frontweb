import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import carImage from "../../assets/images/v1.webp";
import logo from "../../assets/images/nom.png";
import { useAuth } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages.
    console.log("Login data:", { login, password });
  
    try {
      const response = await axios.post("http://localhost:7001/users/login", {
        login,
        password,
      });
      console.log("Login response:", response.data);
  
      // Check if the response structure is as expected
      if (response.data?.user) {
        const user = response.data.user;
        console.log("User  data:", user); // Log user data
  
        // Check if the user's etat is inactive (false)
        if (user.etat === false) {
          setError("Votre compte est inactif. Merci de contacter l'administration.");
          console.log("Access denied for user with inactive account.");
          return; // Stop execution here
        }
  
        // Proceed only if etat is active (true)
        if (response.status === 200 && user.etat === true) {
          console.log("User  is active, proceeding to login..."); // Log before navigation
          localStorage.setItem("user", JSON.stringify(user));
          authLogin(user.role); // Set user role in context
          navigate("/"); // Redirect to the home page
          return; // Stop any further execution
        } else {
          console.log("User  is not active or response status is not 200.");
        }
      } else {
        setError("Invalid response structure. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      setError(error.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div style={styles.login}>
      <div style={styles.loginContainer}>
        <div style={styles.loginLeft}>
          <img src={carImage} alt="Car" style={styles.carImage} />
        </div>
        <div style={styles.loginRight}>
          <img src={logo} alt="Logo" style={styles.logo} />

          {error && <p style={styles.errorMessage}>{error}</p>}
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="text"
              id="login"
              name="login"
              style={styles.inputField}
              placeholder="Nom d'utilisateur"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              aria-label="Nom d'utilisateur"
            />
            <input
              type="password"
              id="password"
              name="password"
              style={styles.inputField}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Mot de passe"
            />
            <button
              type="submit"
              style={styles.loginBtn}
              aria-label="Se connecter"
              disabled={!login || !password} // Disable if login or password is empty
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>

    
      
    </div>
  );
}

const styles = {
  login: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    backgroundColor: "#f0f4f8",
    fontFamily: "'Montserrat', sans-serif",
  },
  loginContainer: {
    display: "flex",
    width: "80%",
    maxWidth: "700px",
    height: "500px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
  },
  loginLeft: {
    flex: 1,
    backgroundImage: `url(${carImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px 0 0 20px",
    boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.5)",
  },
  carImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "20px 0 0 20px",
  },
  loginRight: {
    flex: 1,
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: "250px",
    height: "auto",
  },
  form: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    width: "85%",
    padding: "15px 20px",
    margin: "10px 0",
    border: "1px solid #a0c4e8",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "400",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  loginBtn: {
    width: "60%",
    padding: "15px 30px",
    backgroundColor: "#5271ff",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  errorMessage: {
    color: "#e74c3c",
    marginBottom: "20px",
    fontSize: "16px",
    textAlign: "center",
  },
};

export default Login;
