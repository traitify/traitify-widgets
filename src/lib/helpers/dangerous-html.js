/* eslint-disable react/no-danger */
import PropTypes from "prop-types";
import {Component} from "react";

export default class DangerousHTML extends Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    tag: PropTypes.string
  }
  static defaultProps = {tag: "div"}
  render() {
    const {html, tag: Tag, ...props} = this.props;

    return <Tag dangerouslySetInnerHTML={{__html: html}} {...props} />;
  }
}
