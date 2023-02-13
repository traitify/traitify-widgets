import BaseMarkdown from "markdown-to-jsx";

export default function Markdown(_props) {
  const {className: _class, ...props} = _props;
  const className = [_class, "traitify--markdown"].filter(Boolean).join(" ");
  const options = {
    overrides: {
      a: {
        component: "a",
        props: {rel: "noopener noreferrer", target: "_blank"}
      }
    }
  };

  return <BaseMarkdown className={className} options={options} {...props} />;
}
