import PropTypes from "prop-types";

function DangerousHTML({html, tag: Tag = "div", ...props}) {
  return <Tag dangerouslySetInnerHTML={{__html: html}} {...props} />;
}

DangerousHTML.propTypes = {
  html: PropTypes.string.isRequired,
  tag: PropTypes.string
};

export default DangerousHTML;
