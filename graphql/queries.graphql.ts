import gql from "graphql-tag";

export const SearchQuery = gql`
  query Search($query: String!) {
    search(query: $query) {
      title
      id
      cover_image
      year
      country
    }
  }
  query Tracks($release_id: ID!) {
    tracks(release_id: $release_id) {
      title
      duration
      position
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
