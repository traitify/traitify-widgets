import Components from "components";
import GraphQL from "lib/graphql";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";
import Traitify from "lib/traitify";

export {Components, Http, I18n, GraphQL, Listener, Traitify};

const traitify = new Traitify();

traitify.Components = Components;
traitify.GraphQL = GraphQL;

export default traitify;
