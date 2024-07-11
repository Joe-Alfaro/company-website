import useContent from "hooks/useContent";
import { useEffect, useMemo } from "react";
import css from "./styles.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

  function CardText({ text }: { text: string }) {
    const cardText = text.replace(
      "receive the reward",
      "<span>receive the reward</span>"
    );
    return (
      <p
        className={css.cardText}
        dangerouslySetInnerHTML={{ __html: cardText }}
      />
    );
  }

  function CreateAnOfferImages() {
    return (
      <>
        <div className={css.backgroundCard} />
        <div className={css.mainCard}>
          <img className={css.brandLogo} src="/tapInLogo.svg" />
          <p className={css.spotsLeft}>29 spots available</p>
          <p className={css.offer}>25 off</p>
          <p className={css.description}>
            Record a reel of the Tap In Lounge and receive $20 off your next
            order
          </p>
        </div>
        <img className={css.tehlLogo} src="/tehlCircleLogo.svg" />
        <img className={css.stock} src="/stock5.png" />
      </>
    );
  }
  function TellYourCustomersImages() {
    return (
      <div className={css.tellYourCustomers}>
        <img className={css.instructions} src="/instructionCard.png" />
        <img className={css.instagramPost} src="/instagramPost.png" />
      </div>
    );
  }
  function UseYourFavoriteImage() {
    const videos = [];
    for (let i = 0; i < 6; i++) {
      videos.push(`/favoritePosts${i + 1}.mp4`);
    }

    return (
      <Carousel
        autoPlay
        axis="horizontal"
        interval={8000}
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
      >
        {videos.map((video) => (
          <video className={css.video} key={video} src={video} autoPlay muted />
        ))}
      </Carousel>
    );
  }

  const Images: Array<() => JSX.Element> = [
    CreateAnOfferImages,
    TellYourCustomersImages,
    UseYourFavoriteImage,
  ];

  return (
    <section className={css.container}>
      <ol className={css.cardContainer}>
        {data?.map((card, index) => {
          const Image = Images[index];

          if (!Image) {
            return null;
          }

          return (
            <li className={css.card}>
              <h3>{card.heading}</h3>
              <div className={css.imageArea}>
                <Image />
              </div>
              <CardText text={card.text} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
