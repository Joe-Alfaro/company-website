import useContent from "hooks/useContent";
import { useEffect, useMemo } from "react";
import css from "./styles.module.css";

interface Props {
  sectionId: string;
}

interface SectionData {
  section: {
    contentCollection: {
      items: Array<{
        sys: { id: string };
      }>;
    };
  };
}

interface ContentData {
  contentCollection: {
    items: Array<{
      sys: { id: string };
      text: string;
    }>;
  };
}

type Content = Array<{
  id: string;
  heading: string;
  text: string;
}>;

export default function Steps({ sectionId }: Props): JSX.Element {
  const query = useMemo(
    () =>
      `
  {
  section(id: "${sectionId}") {
    heading
    description
    contentCollection{
      items {
        sys {
          id
        }
      }
    }
  }
}
  `,
    [sectionId]
  );

  const { data: contentIds } = useContent<SectionData, Array<string>>(query, {
    onSuccess(data) {
      return data.section.contentCollection.items.map((item) => item.sys.id);
    },
  });
  console.log(contentIds);

  const contentIdsString = contentIds?.length
    ? `["${contentIds?.join(`", "`)}"]`
    : null;
  const contentQuery = useMemo(
    () =>
      `
{
  contentCollection(where: {sys: {id_in: ${contentIdsString} }}) {
    items {
      sys {
        id
      }
        heading
      text
    }
  }
}
  `,
    [contentIdsString]
  );

  const [fetchContent, { data }] = useContent<ContentData, Content>(
    contentQuery,
    {
      isLazy: true,
      onSuccess(data) {
        return data.contentCollection.items.map(({ sys, ...item }) => ({
          id: sys.id,
          ...item,
        }));
      },
    }
  );

  useEffect(() => {
    fetchContent();
  }, [contentIdsString]);

  console.log(data);

  return (
    <section className={css.container}>
      <div className={css.card}>
        <h3>{data?.[0].heading}</h3>
        <div className={css.imageArea}></div>
        <p>{data?.[0].text}</p>
      </div>
      <div className={css.card}>
        <h3>{data?.[1].heading}</h3>
        <div className={css.imageArea}></div>
        <p>{data?.[1].text}</p>
      </div>
      <div className={css.card}>
        <h3>{data?.[2].heading}</h3>
        <div className={css.imageArea}></div>
        <p>{data?.[2].text}</p>
      </div>
    </section>
  );
}
