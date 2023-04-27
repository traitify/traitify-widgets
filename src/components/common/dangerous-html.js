/* eslint-disable react/no-danger */
import PropTypes from "prop-types";

function DangerousHTML({html, tag: Tag, ...props}) {
  return <Tag dangerouslySetInnerHTML={{__html: html}} {...props} />;
}

DangerousHTML.defaultProps = {tag: "div"};
DangerousHTML.propTypes = {
  html: PropTypes.string.isRequired,
  tag: PropTypes.string
};

export default DangerousHTML;
