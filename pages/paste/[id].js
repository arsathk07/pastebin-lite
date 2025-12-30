import pool from "../../lib/db";

export async function getServerSideProps({ params, req }) {
  const { id } = params;

  const result = await pool.query(
    "SELECT content FROM pastes WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    return { notFound: true };
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = `${protocol}://${host}/paste/${id}`;

  return {
    props: {
      content: result.rows[0].content,
      url,
    },
  };
}

export default function PasteView({ content, url }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paste</h1>

      <pre style={styles.pasteBox}>{content}</pre>

      <div style={styles.linkBox}>
        <p style={{ marginBottom: "5px" }}>Shareable Link:</p>
        <code>{url}</code>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "60px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "15px",
  },
  pasteBox: {
    backgroundColor: "#f4f4f4",
    padding: "15px",
    borderRadius: "6px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "monospace",
    fontSize: "15px",
  },
  linkBox: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#fafafa",
  },
};
