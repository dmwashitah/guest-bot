// utils/messageHandler.js
const ROOMS = {
  standard: {
    name: "Standard Room",
    price: "$30 per night",
    description: "Basic room with double bed, fan, and ensuite bathroom.",
    image: "https://yourhosting.com/images/standard.jpg"
  },
  deluxe: {
    name: "Deluxe Room",
    price: "$50 per night",
    description: "Spacious room with AC, queen bed, Wi-Fi, and TV.",
    image: "https://yourhosting.com/images/deluxe.jpg"
  }
};

function getRoomReply(messageText) {
  const key = messageText.toLowerCase().trim();
  const room = ROOMS[key];
  if (room) {
    return {
      text: `${room.name}\nPrice: ${room.price}\n${room.description}`,
      image: room.image
    };
  } else {
    return {
      text: "Welcome to Mathanda Guest House! 🌟\n\nReply with:\n- standard\n- deluxe\n\nTo see room options."
    };
  }
}

module.exports = { getRoomReply };
