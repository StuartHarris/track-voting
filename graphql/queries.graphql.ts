import gql from "graphql-tag";

export const SearchQuery = gql`
  query SearchQuery($search: String!) {
    masters(search: $search) {
      title
      id
      cover_image
      year
      country
    }
  }
  query Choices {
    choices {
      choice1
      choice2
      choice3
      choice4
      choice5
    }
  }
`;
