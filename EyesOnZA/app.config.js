import appConfig from "./app.base.json";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  ...appConfig,
  expo: {
    ...appConfig.expo,
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};