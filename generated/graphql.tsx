import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  search: Array<SearchResult>;
  release?: Maybe<Release>;
  choices?: Maybe<Choices>;
};


export type QuerySearchArgs = {
  query: Scalars['String'];
};


export type QueryReleaseArgs = {
  id: Scalars['ID'];
};


export type QueryChoicesArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type SearchResult = {
  __typename?: 'SearchResult';
  id: Scalars['ID'];
  title: Scalars['String'];
  label?: Maybe<Array<Maybe<Scalars['String']>>>;
  cover_image?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type Release = {
  __typename?: 'Release';
  id: Scalars['ID'];
  title: Scalars['String'];
  artists?: Maybe<Array<Maybe<Artist>>>;
  labels?: Maybe<Array<Maybe<Label>>>;
  notes?: Maybe<Scalars['String']>;
  released?: Maybe<Scalars['String']>;
  tracklist?: Maybe<Array<Maybe<Track>>>;
  images?: Maybe<Array<Maybe<Image>>>;
};

export type Artist = {
  __typename?: 'Artist';
  name?: Maybe<Scalars['String']>;
};

export type Label = {
  __typename?: 'Label';
  catno?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Image = {
  __typename?: 'Image';
  resource_url?: Maybe<Scalars['String']>;
};

export type Track = {
  __typename?: 'Track';
  title: Scalars['String'];
  duration: Scalars['String'];
  position: Scalars['String'];
};

export type Choices = {
  __typename?: 'Choices';
  id: Scalars['ID'];
  choice1?: Maybe<Scalars['String']>;
  choice2?: Maybe<Scalars['String']>;
  choice3?: Maybe<Scalars['String']>;
  choice4?: Maybe<Scalars['String']>;
  choice5?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  choices?: Maybe<Choices>;
};


export type MutationChoicesArgs = {
  id?: Maybe<Scalars['ID']>;
  choice1?: Maybe<Scalars['String']>;
  choice2?: Maybe<Scalars['String']>;
  choice3?: Maybe<Scalars['String']>;
  choice4?: Maybe<Scalars['String']>;
  choice5?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type SearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { search: Array<(
    { __typename?: 'SearchResult' }
    & Pick<SearchResult, 'id' | 'title' | 'label' | 'cover_image' | 'year' | 'country'>
  )> }
);

export type ReleaseQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ReleaseQuery = (
  { __typename?: 'Query' }
  & { release?: Maybe<(
    { __typename?: 'Release' }
    & Pick<Release, 'title' | 'notes' | 'released'>
    & { artists?: Maybe<Array<Maybe<(
      { __typename?: 'Artist' }
      & Pick<Artist, 'name'>
    )>>>, labels?: Maybe<Array<Maybe<(
      { __typename?: 'Label' }
      & Pick<Label, 'catno' | 'name'>
    )>>>, tracklist?: Maybe<Array<Maybe<(
      { __typename?: 'Track' }
      & Pick<Track, 'title' | 'duration' | 'position'>
    )>>>, images?: Maybe<Array<Maybe<(
      { __typename?: 'Image' }
      & Pick<Image, 'resource_url'>
    )>>> }
  )> }
);

export type ChoicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ChoicesQuery = (
  { __typename?: 'Query' }
  & { choices?: Maybe<(
    { __typename?: 'Choices' }
    & Pick<Choices, 'choice1' | 'choice2' | 'choice3' | 'choice4' | 'choice5'>
  )> }
);


export const SearchDocument = gql`
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
    `;

export function useSearchQuery(options: Omit<Urql.UseQueryArgs<SearchQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchQuery>({ query: SearchDocument, ...options });
};
export const ReleaseDocument = gql`
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
    `;

export function useReleaseQuery(options: Omit<Urql.UseQueryArgs<ReleaseQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ReleaseQuery>({ query: ReleaseDocument, ...options });
};
export const ChoicesDocument = gql`
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

export function useChoicesQuery(options: Omit<Urql.UseQueryArgs<ChoicesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ChoicesQuery>({ query: ChoicesDocument, ...options });
};