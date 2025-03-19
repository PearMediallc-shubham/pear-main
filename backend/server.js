const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const passport = require("passport");
// const session = require("express-session");
require("dotenv").config();
const trafficRoutes = require("./routes/trafficRoutes");
 
const { getAuthUrl, getTokensFromCode, fetchCampaigns } = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json());           // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(cors());
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend domain
    credentials: true, // Allow cookies & authentication headers
  })
);

// app.use(express.json());
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "my_secret_key",
//     resave: false,
//     saveUninitialized: false, 
//   })
// );

// //APPInitialize Passport (Must be after session middleware)
// app.use(passport.initialize());
// app.use(passport.session());

// // APPFacebook OAuth - Redirect to Facebook Login
// app.get("/auth/facebook", (req, res) => {
//   const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_CALLBACK_URL}&scope=email`;
//   res.json({ authUrl });
// });


// // APPFacebook OAuth Callback
// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/auth/facebook/fail" }),
//   (req, res) => {
//     if (!req.user) {
//       return res.status(401).json({ error: "Facebook authentication failed" });
//     }
    
//     const token = req.user.accessToken || req.user.token; 
//     if (!token) {
//       return res.status(500).json({ error: "Authentication successful, but no token received" });
//     }
    
//     res.redirect(`http://localhost:5000/dashboard?token=${token}`);
//   }
// );

// // APPFailure Route
// app.get("/auth/facebook/fail", (req, res) => {
//   res.status(401).json({ error: "Facebook authentication failed" });
// });

// // APPLogout Route
// app.get("/auth/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).json({ error: "Logout failed" });
//     res.json({ message: "Logged out successfully" });
//   });
// });

// // APPGoogle OAuth - Redirect to Google Login
// app.get("/auth/google", async (req, res) => {
//   try {
//     const authUrl = getAuthUrl();
//     res.json({ authUrl });
//   } catch (error) {
//     console.error("Error generating Google Auth URL:", error);
//     res.status(500).json({ error: "Failed to generate Google Auth URL" });
//   }
// });

// // APPGoogle OAuth Callback
// app.get("/auth/google/callback", async (req, res) => {
//   const { code } = req.query;
//   if (!code) {
//     return res.status(400).json({ error: "Authorization code is missing" });
//   }

//   try {
//     const tokens = await getTokensFromCode(code);
//     if (!tokens.access_token) {
//       return res.status(500).json({ error: "Google authentication failed - No access token" });
//     }

//     const campaigns = await fetchCampaigns(tokens.access_token);
//     res.json({
//       message: "Google Ads authenticated successfully",
//       campaigns,
//       tokens,
//     });
//   } catch (error) {
//     console.error("Error in Google OAuth Callback:", error);
//     res.status(400).json({ error: "Failed to authenticate with Google Ads" });
//   }
// });

// // APPFetch Google Ads Campaigns (Requires Access Token)
// app.get("/api/google-ads/campaigns", async (req, res) => {
//   const { access_token } = req.query;
//   if (!access_token) {
//     return res.status(400).json({ error: "Access token is required" });
//   }

//   try {
//     const campaigns = await fetchCampaigns(access_token);
//     res.json({ campaigns });
//   } catch (error) {
//     console.error("Error fetching campaigns:", error);
//     res.status(500).json({ error: "Failed to fetch Google Ads campaigns" });
//   }
// });

// // Store Pixel ID and Access Token
// // Get all templates

app.use('/api/traffic', trafficRoutes);

// app.get("/api/templates", (req, res) => {
//   res.json(templates);
// });

// Add a new template
app.post("/api/traffic/connect-facebook", (req, res) => {
  console.log("Raw Body:", req.body);  // Log the raw body for debugging

  const { pixelId, conversionToken } = req.body;

  // Check if data is properly received
  if (pixelId && conversionToken) {
      console.log("Received Pixel ID:", pixelId);
      console.log("Received Conversion Token:", conversionToken);
      res.status(200).json({ message: "Connected successfully!" });
  } else {
      console.log("Invalid data received:", req.body);  // Log the body if invalid
      res.status(400).json({ message: "Invalid data provided." });
  }
});




app.post("/api/facebook-integration", (req, res) => {
  const { pixelID, apiToken, eventName, customMatching } = req.body;

  if (!pixelID || !apiToken || !eventName) {
    return res.status(400).json({ message: "Please fill in all mandatory fields." });
  }

  console.log("Received data:", { pixelID, apiToken, eventName, customMatching });

  res.status(200).json({ message: "Facebook integration saved successfully!" });
});


app.post("/api/facebook-datasource", (req, res) => {
  const { pixelID, apiToken, eventName, customConversion } = req.body;

  // Save to DB
  res.send({ message: "Facebook Data Source saved successfully!" });
});


// APPImport Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// APPRoot Route
app.get("/", (req, res) => {
  res.send("Welcome to the OAuth API Server");
});

// APPStart Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
