const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const sharp = require("sharp"); // Import the sharp library

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  if (message.hasMedia) {
    const media = await message.downloadMedia();

    // Process images to be square
    if (media.mimetype.startsWith("image/")) {
      try {
        // Convert the base64 media data to a buffer
        const imageBuffer = Buffer.from(media.data, "base64");

        // Use sharp to resize the image to 512x512 and convert to WebP format
        const stickerBuffer = await sharp(imageBuffer)
          .resize(512, 512)
          .webp()
          .toBuffer();

        // Create a new MessageMedia object from the processed buffer
        const stickerMedia = new MessageMedia(
          "image/webp",
          stickerBuffer.toString("base64"),
          "sticker.webp"
        );

        // Send the processed sticker
        client.sendMessage(message.from, stickerMedia, {
          sendMediaAsSticker: true,
          stickerName: "My Sticker",
          stickerAuthor: "Bot do gaabrzx",
        });
      } catch (error) {
        console.error("Failed to process image:", error);
        message.reply("Sorry, I couldn't process that image.");
      }
    }
    // For videos, send them directly as the library handles them well
    else if (media.mimetype.startsWith("video/")) {
      client.sendMessage(message.from, media, {
        sendMediaAsSticker: true,
        stickerName: "Video Sticker",
        stickerAuthor: "Bot do Gabriel",
      });
    }
  }
});

client.initialize();
