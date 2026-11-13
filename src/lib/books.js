const OPEN_LIBRARY_API = "https://openlibrary.org";
const SUBJECT_LIMIT = 24;

const normalizeBook = (work) => ({
  id: work.key.split("/").pop(),
  name: work.title,
  author: (work.authors || []).map((author) => author.name).filter(Boolean).join(", "),
  year: work.first_publish_year,
  coverUrl: work.cover_id
    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
    : "",
});

export const fetchBooks = async (subject) => {
  const response = await fetch(
    `${OPEN_LIBRARY_API}/subjects/${encodeURIComponent(subject)}.json?limit=${SUBJECT_LIMIT}`
  );

  if (!response.ok) {
    throw new Error(`Open Library request failed (${response.status})`);
  }

  const result = await response.json();

  if (!Array.isArray(result.works)) {
    throw new Error("Open Library returned an invalid book list");
  }

  return result.works.map(normalizeBook);
};
