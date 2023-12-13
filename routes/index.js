var express = require("express");
var router = express.Router();
require("dotenv").config();

const apiKey = process.env.openaiKey;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("index.html", { root: "public" });
});

router.post("/api", async function (req, res, next) {
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a doctor, skilled on explaining the disease and giving cure step to the patient. Shorten the conversation as much as possible.`,
        },
        {
          role: "user",
          content: req.body.messages[0].content,
        },
      ],
    }),
  }).then(async (response) => {
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      res.json(data);
    } else {
      console.log("Error");
    }
  });
 
});

module.exports = router;
