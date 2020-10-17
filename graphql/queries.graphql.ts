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
  query Versions($master_id: ID!) {
    versions(master_id: $master_id) {
      id
      title
      label
      released
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
