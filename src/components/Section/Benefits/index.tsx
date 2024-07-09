import useContent from "hooks/useContent";
import { useEffect, useMemo } from "react";
import css from "./styles.module.css";

interface Props {
  sectionId: string;
}

interface SectionData {
  section: {
    sys: {
      id: string;
    };
    heading: string;
    contentCollection: {
      items: Array<{
        sys: { id: string };
      }>;
    };
  };
}

interface Section {
  id: string;
  heading: string;
  contentIds: Array<string>;
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
  text: string;
}>;

export default function Benefits({ sectionId }: Props) {
  const query = useMemo(
    () =>
      `
  {
  section(id: "${sectionId}") {
    sys{
      id
    }
    heading
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

  const { data: sectionData } = useContent<SectionData, Section>(query, {
    onSuccess(data) {
      const contentIds = data.section.contentCollection.items.map(
        (item) => item.sys.id
      );
      return {
        id: data.section.sys.id,
        heading: data.section.heading,
        contentIds,
      };
    },
  });

  const contentIds = sectionData?.contentIds ?? [];

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

  return (
    <section className={css.container}>
      <div>
        <h2 className={css.card}>{sectionData?.heading}</h2>
        <ol className={css.listContainer}>
          {contentIds?.map((contentId) => {
            /* data is out of order. Need to map over original list to maintain order from contentful */
            const content = data?.find((content) => content.id === contentId);

            if (content) {
              return (
                <li className={css.card} key={content.id}>
                  {content.text}
                </li>
              );
            }
            return null;
          })}
        </ol>
      </div>
      <img
        className={css.image}
        src="/tapIn.jpg"
        alt="Empty bar stools at a bar at Tap In"
      />
    </section>
  );
}
