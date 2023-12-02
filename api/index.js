import express from "express"
import postRoutes from "./routes/posts.js"
import usertRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"

const app = express()
app.use(
    cors({
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      origin:"http://localhost:3000"
    })
  );
  

app.use(express.json())
app.use(cookieParser( ))


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../client/public/upload')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+file.originalname)
//   }
// })

// const upload = multer({ storage}) 

// app.post('/api/upload', upload.single('file'), function (req, res) {
//   const file = req.file;
//   const { title, desc, cat } = req.body
//  res.status(200).json(file.filename)
//  console.log("data:",title,desc,cat);
//  console.log(file,"hi")

//   const token = req.cookies.access_token;
//      if (!token) return res.status(401).json("Not authenticated!");
   
//      jwt.verify(token, "jwtkey", (err, userInfo) => {
//        if (err) return res.status(403).json("Token is not valid!");
   
//        const q= "INSERT INTO posts(`title`,`desc`,`img`,`cat`,`date`,`uid` ) VALUES(?)"

//      const values =[
//           req.body.title,
//           req.body.desc,
//           req.body.img,
//           req.body.cat,
//           req.body.date,
//           userInfo.id
//      ]
     
//    console.log(values,"values heer")
//      db.query(q,[values],(err,data)=>{
//           if (err) return res.status(500).json(err);
//           return res.json("post created!");
//      })

//      });
// }







// })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
  try {
    const file = req.file;
    const { title, desc, cat } = req.body;

    console.log("data:", title, desc, cat);
    console.log(file, "hi");

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", async (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const q =
        "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid` ) VALUES(?, ?, ?, ?, ?, ?)";

      const values = [
        title,
        desc,
        file.filename, // Assuming you want to store the filename in the database
        cat,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Assuming you want to store the current date
        userInfo.id,
      ];

      console.log("Query values:", values); // Log the query values

      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log("Database response:", data); // Log the database response
        return res.json("post created!");
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

























app.use("/api/posts" ,postRoutes)
app.use("/api/users",usertRoutes)
app.use("/api/auth",authRoutes);



app.listen(8600,()=>{
    console.log("connected");
})