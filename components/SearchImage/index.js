import { useState, useEffect } from "react";
import styles from "./SearchImage.module.css";
import { useClickOutside } from "@mantine/hooks";
import axios from "axios";
import search from "../../assets/images/search.svg";
import Image from "next/image";
import { Box } from "@mantine/core";

const SearchImage = ({ placeholder, onSubmit }) => {
  const [imageSearch, setImageSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [dataImage, setDataImage] = useState([]);
  const ref = useClickOutside(() => setOpened(false), ["mouseup", "touchend"]);

  const handleChange = (e) => {
    e.preventDefault();
    setImageSearch(e.target.value);
  };

  const handleSubmit = () => {
    getSearchedImages();
  };

  const handleClick = (element) => {
    setImageSearch(element.src.medium);
    setOpened(false);
  };

  useEffect(() => {
    onSubmit(imageSearch)
  }, [imageSearch]);

  async function getSearchedImages(imageSearch, e) {
    const data = `?query=${imageSearch}&per_page=10&locale=fr-FR`;
    const response = await axios.get(
      `https://api.pexels.com/v1/search${data}`,
      {
        headers: {
          Authorization:
            "563492ad6f91700001000001fa3ba1c4f717433fa7f0c75b6bd09180",
          "Content-Type": "text/plain",
        },
      }
    );
    setDataImage(response.data.photos);
  }

  useEffect(() => {
    if (imageSearch !== "" && imageSearch.startsWith("https://") !== true) {
      getSearchedImages(imageSearch);
    }
  }, [imageSearch]);

  return (
    <div className={styles.size}>
      <input
        type="search"
        placeholder={placeholder}
        className={styles.search}
        value={imageSearch}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClick={() => setOpened(true)}
      ></input>
      <div className={styles.img}>
        <Image src={search} width={20} height={20} />
      </div>
      <div className={styles.searchbox}>
        {imageSearch && (
          <div>
            {opened && dataImage.length > 0 && (
              <Box ref={ref} className={styles.box}>
                {dataImage?.map((element) => {
                  return (
                    <div
                      className={styles.linkbox}
                      onClick={() => handleClick(element)}
                    >
                      <img
                        src={element.src.tiny}
                        width={40}
                        height={40}
                        className={styles.iconImg}
                      />
                      <a className={styles.a}>{element.alt}</a>
                    </div>
                  );
                })}
              </Box>
            )}
          </div>
        )}
      </div>
      <></>
    </div>
  );
};

export default SearchImage;
