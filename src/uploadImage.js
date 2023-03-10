import axios from "axios";
import { getError } from "./utils";

export const uploadImage = async (file, token, percentHandler) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        percentHandler(percent);
        console.log(`${loaded}kb of ${total}kb | ${percent}`);
      },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }
    const { data } = await axios.post(
      "https://boston-api.adaptable.app/api/admin/image",
      bodyFormData,
      options,
    );                                               
    if (data.data.location) {
      console.log('location', data.data.location);
      return data.data.location;
    }
  } catch (err) {
    return { error: getError(err) };
  }
};
