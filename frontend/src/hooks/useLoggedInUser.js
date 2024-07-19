import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import auth from "../firebase.init.js";

const useLoggedInUser = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  // console.log(email);
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/loggedInUser?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLoggedInUser(data[0]);
      });
  }, [email]);

  return [loggedInUser, setLoggedInUser];
};

export default useLoggedInUser;
