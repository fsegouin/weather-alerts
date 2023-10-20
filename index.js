require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LOCATION_LAT}&lon=${process.env.LOCATION_LON}&appid=${process.env.OPENWEATHERMAP_API_TOKEN}`;
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const chatId = process.env.TELEGRAM_CHAT_ID;

async function getWeatherData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const rain = data.rain && data.rain['1h'] ? data.rain['1h'] : null;
    const windDirection = degToCardinal(data.wind.deg);
    const windSpeed = msToKmh(data.wind.speed);

    if (rain) {
      const message = `Rain: ${rain} - Wind at ${windSpeed} km/h coming from ${windDirection}`;
      bot.sendMessage(chatId, message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function msToKmh(metersPerSecond) {
  return Math.floor(metersPerSecond * 3.6);
}

function degToCardinal(deg) {
  if (deg >= 337.5 || deg < 22.5) {
    return 'North';
  } else if (deg >= 22.5 && deg < 67.5) {
    return 'North-East';
  } else if (deg >= 67.5 && deg < 112.5) {
    return 'East';
  } else if (deg >= 112.5 && deg < 157.5) {
    return 'South-East';
  } else if (deg >= 157.5 && deg < 202.5) {
    return 'South';
  } else if (deg >= 202.5 && deg < 247.5) {
    return 'South-West';
  } else if (deg >= 247.5 && deg < 292.5) {
    return 'West';
  } else {
    return 'North-West';
  }
}

getWeatherData()
