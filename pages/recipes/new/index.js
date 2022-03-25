import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserContext } from "../../../context/UserContext";
import AddRecipesIngredients from "../../../components/addRecipe/addRecipesIngredients";
import AddRecipesTags from "../../../components/addRecipe/addRecipesTags";
import AddRecipesSteps from "../../../components/addRecipe/addRecipesSteps";
import prisma from "../../../lib/prisma.ts";
import Button from "../../../components/Button";
import classes from "./Recipe.module.css";
import Selector from "../../../components/Selector";
import { useNotifications } from "@mantine/notifications";
import { Select } from "@mantine/core";
import { useRouter } from "next/router";

const newRecipe = ({ countries, types, dishes, tags, ingredients, units }) => {
  const notifications = useNotifications();
  const formRef = useRef();
  const { user } = useUserContext();
  const token = Cookies.get("token");
  const [recipe, setRecipe] = useState(null);
  const [checked, setChecked] = useState(false);
  const [style, setStyle] = useState(false);
  const [count, setCount] = useState(1);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [dishValue, setDishValue] = useState("");
  const router = useRouter();

  const countriesData = [];
  countries.map((element) =>
    countriesData.push({ value: element.id.toString(), label: element.name })
  );
  const typesData = [];
  types.map((element) =>
    typesData.push({ value: element.id.toString(), label: element.name })
  );
  const dishesData = [];
  dishes.map((element) =>
    dishesData.push({ value: element.id.toString(), label: element.title })
  );

  useEffect(() => {
    if (token) {
      return;
    } else {
      notifications.showNotification({
        title: "Connexion",
        message: "Merci de vous connecter pour accéder à cette page",
        color: "red",
      });
      router.push("/login");
    }
  }, [token]);

  const handleClickRight = () => {
    setChecked(true);
    setStyle(true);
  };

  const handleClickLeft = () => {
    setChecked(false);
    setStyle(false);
  };

  // add Recipe
  async function addNewRecipe(params) {
    const { addName, addImageUrl, addPersons } = formRef.current;
    const name = addName.value;
    const imageUrl = addImageUrl.value;
    const country = countryValue;
    const dish = dishValue;
    const type = typeValue;
    const cook = user;
    const persons = addPersons.value;
    if (!name || !persons) {
      notifications.showNotification({
        title: "Erreur dans votre formulaire !",
        message: "Un ou plusieurs éléments sont manquants",
        color: "red",
      });
    } else {
      const result = await axios.post(
        "/api/recipe/addRecipe",
        {
          name,
          imageUrl,
          countryId: parseInt(country),
          cookId: parseInt(cook.id),
          dishId: parseInt(dish),
          typeId: parseInt(type),
          published: JSON.parse(checked),
          persons: parseInt(persons),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
      setRecipe(result.data);
      setStep(step + 1);
    }
  }

  const handleClick = () => {
    setCount(count + 1);
  };

  const handleStepClick = () => {
    setStep(step + 1);
    setCount(1);
  };

  return (
    <div className={classes.main}>
      <h1 className={classes.title}>Ajouter une recette</h1>
      <h2>Etape {step}/4</h2>
      {step === 1 && (
        <>
          <Selector
            left="PRIVÉE"
            right="PUBLIQUE"
            handleClickRight={handleClickRight}
            handleClickLeft={handleClickLeft}
            style={style}
          />
          <form ref={formRef} className={classes.recipeform}>
            {dishes ? (
              <div className={classes.step}>
                <label className={classes.label}>Plat associé</label>
                <Select
                  value={dishValue}
                  onChange={setDishValue}
                  placeholder="Choisissez un plat"
                  data={dishesData}
                  searchable
                  clearable
                />
              </div>
            ) : null}
            <div className={classes.button}>
              <Button label="Nouveau plat" type="primary" href="/dishes/new" />
            </div>
            <div className={classes.step}>
              <label className={classes.label}>Nom de la recette *</label>
              <input
                className={classes.input}
                name="addName"
                type="text"
                placeholder="Ex: Tarte aux pommes de ma grand mère"
              />
            </div>
            <div className={classes.step}>
              <label className={classes.label}>Ajouter une photo</label>
              <input
                className={classes.input}
                name="addImageUrl"
                type="text"
                placeholder="Ex: https://masuperimagedetarte.com"
              />
            </div>
            <div className={classes.step}>
              <label className={classes.label}>Nombre de convives *</label>
              <input
                className={classes.input}
                type="number"
                name="addPersons"
                min="1"
                max="15"
              />
            </div>
            {countries ? (
              <div className={classes.step}>
                <label className={classes.label}>Pays</label>
                <Select
                  value={countryValue}
                  onChange={setCountryValue}
                  placeholder="Choisissez un pays"
                  data={countriesData}
                  searchable
                  clearable
                />
              </div>
            ) : null}
            {types ? (
              <div className={classes.step}>
                <label className={classes.label}>Type de plat</label>
                <Select
                  value={typeValue}
                  onChange={setTypeValue}
                  placeholder="Choisissez un type"
                  data={typesData}
                  searchable
                  clearable
                />
              </div>
            ) : null}
            <div className={classes.button}>
              <Button
                label="Suivant"
                type="primary"
                handleClick={() => addNewRecipe()}
                href="#"
              />
            </div>
          </form>
        </>
      )}
      {step === 2 && (
        <>
          <div className={classes.selector}>
            <div className="selectorBlock">
              <p className={classes.selectorText}>AJOUTER DES INGRÉDIENTS</p>
            </div>
          </div>
          <div className={classes.ingredientform}>
            {recipe ? (
              <>
                {[...Array(count)].map((e, i) => {
                  return (
                    <AddRecipesIngredients
                      recipe={recipe}
                      key={i}
                      ingredients={ingredients}
                      units={units}
                    />
                  );
                })}
              </>
            ) : null}
            <div className={classes.button}>
              <Button
                label="Nouvel ingrédient"
                type="primary"
                handleClick={handleClick}
                href="#"
              />
            </div>
          </div>
          <div className={classes.button}>
            <Button
              label="Suivant"
              type="primary"
              href="#"
              handleClick={() => handleStepClick()}
            />
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className={classes.selector}>
            <div className="selectorBlock">
              <p className={classes.selectorText}>AJOUTER DES ETAPES</p>
            </div>
          </div>
          <div className={classes.ingredientform}>
            {recipe ? (
              <>
                {[...Array(count)].map((e, i) => {
                  return (
                    <AddRecipesSteps recipe={recipe} count={count} key={i} />
                  );
                })}
              </>
            ) : null}
            <div className={classes.button}>
              <Button
                label="Nouvelle étape"
                type="primary"
                handleClick={handleClick}
                href="#"
              />
            </div>
          </div>
          <div className={classes.button}>
            <Button
              label="Suivant"
              type="primary"
              href="#"
              handleClick={() => handleStepClick()}
            />
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <div className={classes.selector}>
            <div className="selectorBlock">
              <p className={classes.selectorText}>AJOUTER DES TAGS</p>
            </div>
          </div>
          <div className={classes.stepsform}>
            <AddRecipesTags recipe={recipe} tags={tags} />
          </div>
          <div className={classes.button}>
            <Button
              label="J'ai fini !"
              type="success"
              href={`/recipes/${recipe?.id}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  const allTypes = await prisma.type.findMany();
  const allCountries = await prisma.country.findMany();
  const allDishes = await prisma.dish.findMany();
  const allIngredients = await prisma.ingredient.findMany();
  const allUnits = await prisma.unit.findMany();
  const allTags = await prisma.tag.findMany();
  return {
    props: {
      dishes: allDishes,
      types: allTypes,
      countries: allCountries,
      tags: allTags,
      ingredients: allIngredients,
      units: allUnits,
    },
  };
}

export default newRecipe;
