const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { getRoomReply } = require("./utils/messageHandler");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "mathanda-verify";
const ACCESS_TOKEN = "EAAKCVLzAFKkBPJpmA8bpFAB5ctWT5KLxrYbMVdDOvuhAJNi1MklZCyreNo87xYhM45XKzkqne9sZAGpsUggZBv4vzrIsuQGDJ97D7gOe3kcHHzQ653Px3Qj4OAlmxTSWHomCGOSvpzhBdMjwcT2SqUQFRnjB7rYfSqbsGSE0AZBI2DZBah9p2eZCtCCi8TbgWR8djNMYfRie957q3MQNNphkPOkFZAZCVjaNJptDNK2tigZDZD";

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Handle WhatsApp messages
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];
  const phone = message?.from;
  const text = message?.text?.body;

  if (text) {
    const reply = getRoomReply(text);
    await axios.post(
      "https://graph.facebook.com/v19.0/YOUR_PHONE_NUMBER_ID/messages",
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: reply.text }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (reply.image) {
      await axios.post(
        "https://graph.facebook.com/v19.0/YOUR_PHONE_NUMBER_ID/messages",
        {
          messaging_product: "whatsapp",
          to: phone,
          type: "image",
          image: { link: reply.image }
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
