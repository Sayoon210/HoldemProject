import styles from "./page.module.css";
import Table from "@/components/Table/Table";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="spotlight-container">
        <Table />
      </div>
    </main>
  );
}
