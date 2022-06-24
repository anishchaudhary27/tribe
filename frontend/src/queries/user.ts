import { IdTokenResult  } from "firebase/auth";
import api from "../api";

const userQueryId = "user";

function readUserQuery(token: IdTokenResult) {
  return function () {
    if (!token) return null;
    return api
      .get("/api/user", {
        headers: {
          "X-AUTH-TOKEN": token.token,
        },
      })
      .then((resp) => {
        return {
          status: resp.status,
          body: resp.data,
        };
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          return {
            status: err.response.status,
            body: {
              message: err.response.data,
            },
          };
        } else {
          return {
            status: 500,
            body: {},
          };
        }
      });
  };
}

interface CreateUserProps {
  name: string;
  handle: string;
  token: string|undefined;
}
function createUserQuery (props:CreateUserProps) {
  return api
    .post(
      "/api/user/create",
      {
        name: props.name,
        handle: props.handle
      },
      {
        headers: {
          "X-AUTH-TOKEN": props.token!,
        },
      }
    )
};

export { userQueryId, readUserQuery, createUserQuery };
