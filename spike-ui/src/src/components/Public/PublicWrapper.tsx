import React from "react";
import { useHistory } from "react-router-dom";
import Public from "./Public";

export default function PublicWrapper() {
    const history = useHistory();
    // @ts-ignore
    return <Public history={history} />;
  };