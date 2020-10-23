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
        type_
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
  query Top {
    top {
      count
      scores {
        track
        score
        votes
      }
    }
  }

  mutation UpdateChoices(
    $choice1: String
    $choice2: String
    $choice3: String
    $choice4: String
    $choice5: String
  ) {
    choices(
      choice1: $choice1
      choice2: $choice2
      choice3: $choice3
      choice4: $choice4
      choice5: $choice5
    ) {
      id
      choice1
      choice2
      choice3
      choice4
      choice5
    }
  }
`;
