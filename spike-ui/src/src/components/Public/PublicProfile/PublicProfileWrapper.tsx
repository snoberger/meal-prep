import React from "react";
import { useHistory } from "react-router-dom";
import PublicProfile from "./PublicProfile";

export default function PublicProfileWrapper(props: any) {
    const history = useHistory();
    // @ts-ignore
    return <PublicProfile history={history} userId={props.userId} />;
  };