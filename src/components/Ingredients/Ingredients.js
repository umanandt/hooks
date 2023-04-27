import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from "react";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredienList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../hooks/http";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;

    case "ADD":
      return [...currentIngredients, action.ingredient];

    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);

    default:
      throw new Error("Should not get there!");
  }
};

{
  /*const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };

    case "RESPONSE":
      return { ...currentHttpState, loading: false };

    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Should not be reached");
  }
};*/
}

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const { loading, error, data, sendRequest, id, reqIdentifier, clear } =
    useHttp();

  {
    /* const [httpState, httpDispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
*/
  }

  useEffect(() => {
    if (!loading && !error && reqIdentifier === "REMOVE_INGREDIENTS") {
      dispatch({ type: "DELETE", id: id });
    } else if (!loading && !error && reqIdentifier === "ADD_INGREDIENTS") {
      dispatch({
        type: "ADD",
        ingredient: { id: data.name, ...data },
      });
    }
  }, [data, reqIdentifier, error, id, loading]);

  const [ingredients, setIngredients] = useState([]);
  //  const [isLoading, setIsLoading] = useState(false);
  //  const [error, setError] = useState();

  useEffect(() => {
    fetch("https://http-1e69d-default-rtdb.firebaseio.com/ingredients.json")
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        //  setIngredients(loadedIngredients);

        dispatch({ type: "SET", ingredients: loadedIngredients });
      });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredients) => {
      sendRequest(
        "https://http-1e69d-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredients),
        ingredients,
        "ADD_INGREDIENTS"
      );
      {
        /*// fetch method in browser - using firebase for it
      // setIsLoading(true);
      httpDispatch({ type: "SEND" });
      fetch("https://http-1e69d-default-rtdb.firebaseio.com/ingredients.json", {
        method: "POST",
        body: JSON.stringify(ingredients),
        headers: { "content-Type": "application/json" },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          // setIsLoading(false);
          httpDispatch({ type: "RESPONSE" });
          //  setIngredients((prevIngredients) => [
          //    ...prevIngredients,
          //    { id: responseData.name, ...ingredients },
          //  ]);
          dispatch({
            type: "ADD",
            ingredient: { id: responseData.name, ...ingredients },
          });
      });

    {
      /*setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredients },
    ]);*/
      }
      //}
    },
    [sendRequest]
  );

  const removeHandler = useCallback(
    (id) => {
      //   setIsLoading(true);
      {
        /*  fetch(
      `https://http-1e69d-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        //  setIsLoading(false);
        //   setIngredients((AllIngredients) =>
        //     AllIngredients.filter((oneIngredients) => oneIngredients.id !== id)
        //   );

        dispatch({ type: "DELETE", id: id });
      })
      .catch((error) => {
        // setError(error.message);
        httpDispatch({ type: "ERROR", errorData: "Something went wrong" });
      });*/
      }
      sendRequest(
        `https://http-1e69d-default-rtdb.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "REMOVE_INGREDIENTS"
      );
    },
    [sendRequest]
  );

  const searchHandler = useCallback(
    (filterIngredients) => {
      setIngredients(filterIngredients);
    },
    [setIngredients]
  );

  const ingredientList = useMemo(() => {
    return (
      <IngredienList
        ingredients={userIngredients}
        onRemoveItem={removeHandler}
      />
    );
  }, [removeHandler, userIngredients]);

  //  const clearError = () => {
  //  setError(null);
  //  setIsLoading(false);
  //httpDispatch({ type: "CLEAR" });
  //   if (!error && !loading) {
  //     clear();
  //   }
  // };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onLoadIngredients={searchHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
