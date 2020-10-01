import React from "react";
import { useHistory } from "react-router-dom";
import Profile from "./profile";

export default function ProfileWrapper() {
    const history = useHistory();
    // @ts-ignore
    return <Profile history={history} />;
  };