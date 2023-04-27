import { useCallback, useReducer } from "react";

const intialState = {
  loading: false,
  error: null,
  data: null,
  id: null,
  identifier: null,
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        id: null,
        identifier: action.identifier,
      };

    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        id: action.id,
      };

    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return intialState;
   //  return { ...currentHttpState, error: null };

    default:
      throw new Error("Should not be reached");
  }
};

const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(httpReducer, intialState);


  const clear = useCallback(() => {
    httpDispatch({ type: "CLEAR" });
  }, []);

  const sendRequest = useCallback((url, method, body, reqIdentifier) => {
    httpDispatch({ type: "SEND", identifier: reqIdentifier });

    fetch(
      //`https://http-1e69d-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      url,
      {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        httpDispatch({
          type: "RESPONSE",
          responseData: responseData,
          reqIdentifier: reqIdentifier,
        });
      })
      .catch((error) => {
        // setError(error.message);
        httpDispatch({ type: "ERROR", errorData: "Something went wrong" });
      });
  }, []);

  return {
    sendRequest,
    loading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    id: httpState.id,
    reqIdentifier: httpState.identifier,
    clear,
  };
};

export default useHttp;
