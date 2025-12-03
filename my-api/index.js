import express from "express";
const app = express();

app.use(express.json());

// Sample GET API
app.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Sample POST API
app.post("/user", (req, res) => {
  res.json({
    success: true,
    receivedData: req.body,
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
