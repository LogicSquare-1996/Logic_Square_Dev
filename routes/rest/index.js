const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const multer = require("multer");
const checkJwt = expressJwt({ secret: process.env.SECRET, algorithms: ['RS256'] }) // the JWT auth check middleware

const users = require("./users")
const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const scrappingRoutes = require("./scrapping.js");
const googleSheetRoutes = require("./googleSheet.js");
const instagramRoutes = require("./instagram.js");
const praseRoutes = require("./parseResume.js")
const redisRoutes = require("./redis.js");
const spreadSheetRoutes = require("./spreadsheet.js");

const upload = multer();

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

//Extract Followers List
router.post("/extractfollowers",upload.array('files', 2), instagramRoutes.extractFollowers);

//Parse Resume Data using Gemini
router.post("/parseResume", upload.single("resume"),praseRoutes.parseResume);

// Redis Routes
router.post("/redis/store", redisRoutes.storeData);
router.get("/redis/get/:key", redisRoutes.getData);
router.delete("/redis/delete/:key", redisRoutes.deleteData);
router.get("/redis/ttl/:key", redisRoutes.getTTL);
router.get("/redis/keys", redisRoutes.listKeys);

router.post("/addmarksheet", spreadSheetRoutes.addMarksheet);
router.post("/addmarkstodb", spreadSheetRoutes.addMarksheetToDB);


// router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user/:id", users.get)

module.exports = router
