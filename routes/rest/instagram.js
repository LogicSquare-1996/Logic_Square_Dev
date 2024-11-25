const Follower = require('../../models/follower');

module.exports = {

    async extractFollowers(req,res){
        // try {
        //     // Check if a file is uploaded
        //     if (!req.file) {
        //       return res.status(400).json({error:true, message: "No file uploaded" });
        //     }
        //     // console.log(req.file.buffer.toString("utf8"));
            
        
        //     // Directly parse the JSON file from the uploaded file's buffer
        //     const fileData = JSON.parse(req.file.buffer.toString("utf8"));
        
        //     // Extract values from the JSON file
        //     const followers = [];
        //     const hrefs = [];
        
        //     fileData.forEach((entry) => {
        //       entry.string_list_data.forEach((item) => {
        //         followers.push(item.value);
        //         // hrefs.push(item.href);
        //       });
        //     });
        
        //     // Store extracted data in the database
        //     const followerRecord = new Follower({ followers, hrefs });
        //     await followerRecord.save();
        
        //     res.status(200).json({error:false,
        //       message: "Followers data successfully extracted and saved to the database",
        //       followers, hrefs
        //     });
        //   } catch (error) {
        //     res.status(500).json({error:true, message: "An error occurred while processing the file" });
        //   }


        try {
            const { userId } = req.body;
      
            // Validate that both files are uploaded and userId is provided
            if (!req.files || req.files.length < 2) {
              return res.status(400).json({ message: "Both files (followers and followings) are required." });
            }
            if (!userId) {
              return res.status(400).json({ message: "User ID is required." });
            }
      
            // Parse the followers data from the first file (index 0)
            const followersFileData = JSON.parse(
              req.files[0].buffer.toString("utf8")
            );
            const followers = [];
            followersFileData.forEach((entry) => {
              entry.string_list_data.forEach((item) => {
                followers.push(item.value);
              });
            });
      
            // Parse the followings data from the second file (index 1)
            const followingsFileData = JSON.parse(
              req.files[1].buffer.toString("utf8")
            );
            const followings = [];
            followingsFileData.forEach((entry) => {
              entry.string_list_data.forEach((item) => {
                followings.push(item.value);
              });
            });
      
            // Save to database
            let userRecord = await Follower.findOne({ userId });
            if (userRecord) {
              // Update existing record
              userRecord.followers = followers;
              userRecord.followings = followings;
            } else {
              // Create new record
              userRecord = new Follower({
                userId,
                followers,
                followings,
              });
            }
            await userRecord.save();
      
            res.status(200).json({
              message: "Files processed and data saved successfully.",
              userId,
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred.", error });
          }
    }
}