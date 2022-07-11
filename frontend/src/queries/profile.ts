import api from "../api";

const profileQueryid = "profile";

function getProfile(handle: string) {
  return api.get("/profile/" + handle).then((resp) => {
    return {
      status: resp.status,
      body: resp.data,
    };
  });
}

export { profileQueryid, getProfile };
