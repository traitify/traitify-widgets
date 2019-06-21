import ApolloClient from "apollo-boost";

export default function apolloClient(key) {
  console.log(key);
  return (
    new ApolloClient({
      headers: {authorization: `Basic ${btoa(`${"576fdf1a7e3e12b6b9eaa0371a"}:x`)}`},
      uri: "https://api.stag.awse.traitify.com/v1/interview_guides/graphql"
    })
  );
}
