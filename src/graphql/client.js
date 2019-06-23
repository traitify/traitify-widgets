import ApolloClient from "apollo-boost";

// maybe this should just follow state
export default function apolloClient(key) {
  console.log(key);
  return (
    new ApolloClient({
      headers: {authorization: "Basic ZGhtZ3NnMWQ2MmJxcDhpb2tqaTEzZnVobWY6eA=="},
      uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
    })
  );
}
