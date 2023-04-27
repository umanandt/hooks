import React from "react";
import Ingredients from "./components/Ingredients/Ingredients";
import { useContext } from "react";
import { AuthContext } from "./components/context/auth-context";
import Auth from "../src/components/Auth";

const App = (props) => {
  const authContext = useContext(AuthContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
