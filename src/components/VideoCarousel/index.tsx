import { ComponentPropsWithoutRef, useState, useEffect } from "react";
import cn from "classnames";
import css from "./styles.module.css";

interface Props extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  videos: Array<string>;
}

export default function VideoCarousel({
  videos,
  className,
  ...restProps
}: Props) {
  const [children, setChildren] = useState(videos);

  useEffect(() => {
    const interval = setInterval(() => {
      setChildren((prevOrder) => {
        const newOrder = [...prevOrder];
        const lastElement = newOrder.pop();

        if (lastElement) {
          newOrder.unshift(lastElement);
        }

        return newOrder;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn([css.carousel, className])} {...restProps}>
      <div className={css.container}>
        {children.map((video, index) => (
          <video
            key={video}
            className={cn({ [css.blur]: index !== children.length - 3 })}
            autoPlay
            loop
            muted
            src={video}
            width="50%"
          />
        ))}
      </div>
    </div>
  );
}
