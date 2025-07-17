import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
const REACT_APP_API_BASE_URL = 'https://erpbackend-gray.vercel.app';
 //import { REACT_APP_API_BASE_URL } from "@env"; // uncomment this line if using dotenv for environment variable management
//import { API_BASE_URL } from "../config/config";// adjust this import based on your project

// Using fetch instead of axios for API calls
import ResponseModal from "../components/ResponseModal";
import Modal from "../components/common/Modal";

const { width, height } = Dimensions.get("window");
const BE_URL = REACT_APP_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const navigation = useNavigation();

  const [msg, setMsg] = useState(null);
  const [responseType, setResponseType] = useState(null);
  const [isResponseOpen, setIsResponseOpen] = useState(false);

  useEffect(() => {
    checkExistingAuth();
    // Debug: Check if BE_URL is working
    console.log("BE_URL:", BE_URL);
    console.log("Using fetch for API calls");
  }, []);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const checkExistingAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem("ERPTokens");
      if (userData) {
        await AsyncStorage.removeItem("ERPTokens");
        console.log("Removed existing auth tokens");
      }
    } catch (error) {
      console.error("Error checking existing auth:", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Enhanced API call function with fetch instead of axios
  const makeApiCall = async (endpoint, data) => {
    try {
      console.log(`Making API call to: ${BE_URL}${endpoint}`);
      console.log("Request data:", data);

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${BE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);

      return { data: responseData }; // Match axios response format
    } catch (error) {
      console.error("API Error:", error);

      if (error.name === "AbortError") {
        // Request timed out
        console.error("Request timed out");
        throw new Error("Network error: Request timed out");
      } else if (error.message && error.message.includes("Server error")) {
        // Server responded with error status
        console.error("Error status:", error.message);
        throw new Error(error.message);
      } else if (!navigator.onLine) {
        // Device is offline
        console.error("Device is offline");
        throw new Error("Network error: No internet connection");
      } else {
        // Something else happened
        console.error("Request error:", error.message);
        throw new Error("Request failed: " + error.message);
      }
    }
  };

  const handleRequestOtp = async () => {
    // Reset errors
    setEmailError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setShowResend(false);
    setIsLoading(true);

    try {
      await makeApiCall("/api/auth/login", { email });

      setIsOtpSent(true);
      setIsLoading(false);
      setResendTimer(30);

      setResponseType("Success");
      setMsg("OTP has been sent to your email.");
      setIsResponseOpen(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setIsLoading(false);

      setResponseType("Error");
      setMsg(
        error.message ||
          "Error generating OTP or the user does not exist. Please try again!"
      );
      setIsResponseOpen(true);
    }
  };

  const handleVerifyOtp = async () => {
    // Reset errors
    setOtpError("");

    // Validate OTP
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await makeApiCall("/api/auth/verify-otp", {
        email,
        otp,
      });

      await AsyncStorage.setItem(
        "ERPTokens",
        JSON.stringify(response.data.tokens)
      );

      const tokenData = jwtDecode(response.data.tokens.accessToken);
      const { name, user_id, email: userEmail, role_id } = tokenData;
      const user = { user_id, name, email: userEmail, role_id };

      // Also store user profile data for easy access
      await AsyncStorage.setItem("ERPUserProfile", JSON.stringify(user));

      console.log("User logged in:", user);
      setIsLoading(false);

      // Navigate based on role - role_id 10 is for students, others for management
      if (role_id === 10) {
        console.log("Navigating to Student Dashboard");
        navigation.reset({
          index: 0,
          routes: [{ name: "Student" }],
        });
      } else {
        console.log("Navigating to Admin Dashboard");
        navigation.reset({
          index: 0,
          routes: [{ name: "Admin" }],
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setIsLoading(false);

      setResponseType("Error");
      setMsg(error.message || "Incorrect OTP. Please try again!");
      setIsResponseOpen(true);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpError("");
    handleRequestOtp();
  };

  const handleBackToEmail = () => {
    setIsOtpSent(false);
    setOtp("");
    setOtpError("");
    setShowResend(false);
    setResendTimer(0);
  };

  // Test connection function for debugging
  const testConnection = async () => {
    try {
      console.log("Testing connection to:", BE_URL);
      const response = await axios.get(`${BE_URL}/api/health`);
      console.log("Connection test successful:", response.status);
      Alert.alert("Connection Test", "API connection is working!");
    } catch (error) {
      console.log("Connection test failed:", error.message);
      Alert.alert("Connection Test", `Failed: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0,0,0,0.3)"
        translucent
      />

      {/* Uncomment when you want to use background image */}
      {/* <ImageBackground
        source={require("../../assets/images/loginbg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      > */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay} />

          <View style={styles.loginForm}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Icon name="business" size={40} color="#fff" />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                {isOtpSent
                  ? "Enter the OTP sent to your email"
                  : "Sign in to your account"}
              </Text>

              {/* Debug button - remove in production */}
              {__DEV__ && (
                <TouchableOpacity
                  onPress={testConnection}
                  style={styles.debugButton}
                >
                  <Text style={styles.debugButtonText}>Test Connection</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="email"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null,
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isOtpSent}
                  />
                  {isOtpSent && (
                    <TouchableOpacity
                      onPress={handleBackToEmail}
                      style={styles.changeButton}
                    >
                      <Icon name="edit" size={18} color="#007AFF" />
                    </TouchableOpacity>
                  )}
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* OTP Input */}
              {isOtpSent && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon
                      name="lock"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        otpError ? styles.inputError : null,
                      ]}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor="#999"
                      value={otp}
                      onChangeText={(text) => {
                        setOtp(text.replace(/[^0-9]/g, ""));
                        setOtpError("");
                      }}
                      keyboardType="numeric"
                      maxLength={6}
                      autoCorrect={false}
                    />
                  </View>
                  {otpError ? (
                    <Text style={styles.errorText}>{otpError}</Text>
                  ) : null}
                </View>
              )}

              {/* Action Button */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={isOtpSent ? handleVerifyOtp : handleRequestOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isOtpSent ? "Verify OTP" : "Send OTP"}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Resend OTP */}
              {isOtpSent && (
                <View style={styles.resendContainer}>
                  {resendTimer > 0 ? (
                    <Text style={styles.resendTimer}>
                      Resend OTP in {resendTimer}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Not a user? </Text>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Contact Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              {isOtpSent ? "Verifying OTP..." : "Sending OTP..."}
            </Text>
          </View>
        </View>
      )}

      {/* Response Modal */}
      <Modal
        isVisible={isResponseOpen}
        onClose={() => setIsResponseOpen(false)}
      >
        <ResponseModal
          type={responseType}
          msg={msg}
          onClick={() => setIsResponseOpen(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  loginForm: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  debugButton: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#ff6b6b",
    borderRadius: 15,
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: "#333",
    paddingRight: 15,
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 1,
  },
  changeButton: {
    padding: 15,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resendTimer: {
    color: "#666",
    fontSize: 14,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    minWidth: 150,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default Login;
