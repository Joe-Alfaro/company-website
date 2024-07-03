interface Props {
  errors: string[];
  HeadingTag?: keyof HTMLElementTagNameMap;
}
export default function Errors({ errors, HeadingTag = "h6" }: Props) {
  if (errors.length) {
    return (
      <>
        <HeadingTag>Encountered Errors</HeadingTag>
        {errors.length === 1 ? (
          <p>{errors[0]}</p>
        ) : (
          <ul>
            {errors.map((error) => (
              <li>{error}</li>
            ))}
          </ul>
        )}
      </>
    );
  }
}
