const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['RS256'] }) // the JWT auth check middleware

const users = require("./users")
const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const scrappingRoutes = require("./scrapping.js");
const googleSheetRoutes = require("./googleSheet.js");

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX

// Scrapping Routes
// Assuming "country" is correct in place of "region"
router.post("/charts/:platform/:country/:category", scrappingRoutes.getScrapData);

router.get("/googleSheet/readdata", googleSheetRoutes.readGoogleSheetData);
router.post("/googleSheet/writedata", googleSheetRoutes.writeGoogleSheetData);
router.post("/googleSheet/updatedata", googleSheetRoutes.updateGoogleSheetData);
router.post("/googleSheet/updatecelldata", googleSheetRoutes.updateSpecificCell);
router.post("/googleSheet/deletedata", googleSheetRoutes.deleteGoogleSheetData);
router.post("/googleSheet/deletecelldata", googleSheetRoutes.deleteGoogleSheetCell);


// router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get)

module.exports = router
