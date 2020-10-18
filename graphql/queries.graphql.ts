import gql from "graphql-tag";

export const SearchQuery = gql`
  query Search($query: String!) {
    search(query: $query) {
      id
      title
      label
      cover_image
      year
      country
    }
  }
  query Release($id: ID!) {
    release(id: $id) {
      title
      artists {
        name
      }
      labels {
        catno
        name
      }
      notes
      released
      tracklist {
        title
        duration
        position
      }
      images {
        resource_url
      }
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
