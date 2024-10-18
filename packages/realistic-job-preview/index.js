import Cache from "traitify/lib/cache";
import Http from "traitify/lib/http";
import I18n from "traitify/lib/i18n";
import Listener from "traitify/lib/listener";
import Components from "./src/components";
import GraphQL from "./src/lib/graphql";
import Widget from "./src/lib/widget";

export {Cache, Components, GraphQL, Http, I18n, Listener, Widget};

const widget = new Widget();

widget.Components = Components;
widget.GraphQL = GraphQL;

export default widget;
