import React from "react";
import { useState, useEffect } from "react/cjs/react.development";
import { useRef } from "react/cjs/react.development";
import axios from "axios";
import prisma from "../../../lib/prisma.ts";
import Cookies from "js-cookie";

const newDish = () => {
  const formRef = useRef();
  const token = Cookies.get("token");
  const [disable, setDisable] = useState(false);
  const [regions, setRegions] = useState(null);

  async function getAllRegions() {
    const result = await axios.get("/api/dish/getRegions");
    setRegions(result.data);
  }

    useEffect(() => {
      getAllRegions();
    }, []);

  async function addNewDish(params) {
    setDisable(true);
    const { addTitle, addDescription, addRegion } = formRef.current;
    const title = addTitle.value;
    const description = addDescription.value;
    const region = addRegion.value;
    await axios.post(
      "/api/dish/addDish",
      {
        title,
        description,
        region,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setDisable(false);
  }

  return (
    <div>
      <form ref={formRef}>
        <div>
          <label>Titre</label>
          <input name="addTitle" type="text" />
        </div>
        <div>
          <label>Description</label>
          <input name="addDescription" type="text" />
        </div>
        <div>
          <label>Region</label>
          <select name="addRegion">
            <option value="afrique">Afrique</option>
            <option value="asie">Asie</option>
          </select>
        </div>
        <button
          disabled={disable}
          className="btn btn-primary my-3"
          onClick={() => addNewDish()}
        >
          Créer un plat
        </button>
      </form>
    </div>
  );
};

export async function getServerSideProps() {
  const allDishes = await prisma.dish.findMany();
  return {
    props: {
      dishes: allDishes,
    },
  };
}

export default newDish;
