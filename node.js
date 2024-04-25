const express = require("express");
const bodyParser = require("body-parser"); 
const admin = require("firebase-admin"); 
const jwt = require("jsonwebtoken"); 


const serviceAccount = require("./serviceAccountKey.json"); 
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Middleware to verify Firebase JWT token
const verifyToken = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authToken.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Apply middleware to routes that require authentication
app.use(verifyToken);

// Route to handle user login and authentication
app.post("/login", async (req, res) => {
  try {
      const { email, uid } = req.body;
      
      if (!email || !uid) {
          return res.status(400).json({ error: "Email and uid are required" });
      }

      // Get the user corresponding to the provided email
      const userRecord = await admin.auth().getUserByEmail(email);

      // Verify that the provided UID matches the UID of the user
      if (userRecord.uid !== uid) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      // If verification is successful, return user data
      res.json({
          uid: userRecord.uid,
          email: userRecord.email,
          // Add any other user data you want to return
      });
  } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(401).json({ error: "Unauthorized" });
  }
});

// Route to retrieve user's to-do list
app.get("/todos/:uid", (req, res) => {
  const uid = req.params.uid;
  const db = admin.firestore();

  // Construct the reference to the user's to-do list
  const todoListRef = db.collection('users').doc(uid).collection('todos');

  // Retrieve the to-do list documents
  todoListRef.get()
    .then((querySnapshot) => {
      const todoList = [];
      querySnapshot.forEach((doc) => {
        todoList.push({
          id: doc.id, // Include the document ID
          data: doc.data() // Include the document data
        });
      });
      res.status(200).json(todoList);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error fetching to-do list", details: error });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
