import Navbar from "../Navbar";
import Footer from "../Footer";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
