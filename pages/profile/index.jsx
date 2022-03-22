import { useUserContext } from "../../context/UserContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserList from "../../components/UserList";
import styles from "./Profile.module.css";
import RecipeCard from "../../components/recipeCard";
import prisma from "../../lib/prisma.ts";
import Selector from "../../components/Selector";
import AddList from "../../components/List/AddList";
import axios from "axios";
import Cookies from "js-cookie";

const Profile = ({ recipes, lists }) => {
  const { user, setUser } = useUserContext();
  const [contribution, setContribution] = useState(false);
  const [style, setStyle] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const token = Cookies.get("token");

  async function getUser() {
    const result = await axios.get("/api/user/getCurrentUser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(result.data.user);
  }

  useEffect(() => {
    getUser();
  }, [submitted]);

  const handleClickLeft = () => {
    setContribution(false);
    setStyle(false);
  };

  const handleClickRight = () => {
    setContribution(true);
    setStyle(true);
  };

  const recipesFromUser = user
    ? recipes.filter((element) => element.cookId === user.id)
    : null;

  const listsFromUser = user
    ? lists.filter((element) => element.userId === user.id)
    : null;

  return (
    <>
      <UserList user={user} color="#ffd12f" />
      <Selector
        left="MES CONTRIBUTIONS"
        right="MES LISTES"
        handleClickLeft={handleClickLeft}
        handleClickRight={handleClickRight}
        style={style}
      />
      <div className={styles.cards}>
        <div className="row">
          {!contribution ? (
            recipesFromUser?.map((recipe, index) => (
              <RecipeCard recipe={recipe} key={index} col="col-3" />
            ))
          ) : (
            <>
              <div className={styles.center}>
                <AddList
                  user={user}
                  setSubmitted={setSubmitted}
                />
              </div>
              {listsFromUser?.map((list) => (
                <>
                  <Link href={"/lists/" + list.id} exact>
                    <div className={styles.listCards}>
                      <div className="row">
                        <div className="col-2">
                          <div className={styles.avatar}>
                            <span className={styles.letter}>
                              {list?.name[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="col-10">
                          <p>{list.name}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const allRecipes = await prisma.recipe.findMany({
    include: {
      _count: { select: { likes: true } },
      _count: { select: { comments: true } },
    },
  });
  const allLists = await prisma.list.findMany({
    include: {
      recipes: true,
      user: { select: { name: true } },
    },
  });
  return {
    props: {
      recipes: allRecipes,
      lists: allLists,
    },
  };
}

export default Profile;
