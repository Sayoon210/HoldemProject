import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import Controls from "@/components/Controls/Controls";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className="spotlight-container">
        <Table />
        <Controls />
      </div>
    </main>
  );
}
