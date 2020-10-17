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
  masters: Array<Master>;
  versions: Array<Version>;
  tracks: Array<Track>;
  choices?: Maybe<Choices>;
};


export type QueryMastersArgs = {
  search: Scalars['String'];
};


export type QueryVersionsArgs = {
  master_id: Scalars['ID'];
};


export type QueryTracksArgs = {
  release_id: Scalars['ID'];
};


export type QueryChoicesArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type Master = {
  __typename?: 'Master';
  id: Scalars['ID'];
  title: Scalars['String'];
  cover_image?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
};

export type Version = {
  __typename?: 'Version';
  id: Scalars['ID'];
  title: Scalars['String'];
  label: Scalars['String'];
  released: Scalars['String'];
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


export type SearchQueryQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchQueryQuery = (
  { __typename?: 'Query' }
  & { masters: Array<(
    { __typename?: 'Master' }
    & Pick<Master, 'title' | 'id' | 'cover_image' | 'year' | 'country'>
  )> }
);

export type VersionsQueryVariables = Exact<{
  master_id: Scalars['ID'];
}>;


export type VersionsQuery = (
  { __typename?: 'Query' }
  & { versions: Array<(
    { __typename?: 'Version' }
    & Pick<Version, 'id' | 'title' | 'label' | 'released'>
  )> }
);

export type TracksQueryVariables = Exact<{
  release_id: Scalars['ID'];
}>;


export type TracksQuery = (
  { __typename?: 'Query' }
  & { tracks: Array<(
    { __typename?: 'Track' }
    & Pick<Track, 'title' | 'duration' | 'position'>
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


export const SearchQueryDocument = gql`
    query SearchQuery($search: String!) {
  masters(search: $search) {
    title
    id
    cover_image
    year
    country
  }
}
    `;

export function useSearchQueryQuery(options: Omit<Urql.UseQueryArgs<SearchQueryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchQueryQuery>({ query: SearchQueryDocument, ...options });
};
export const VersionsDocument = gql`
    query Versions($master_id: ID!) {
  versions(master_id: $master_id) {
    id
    title
    label
    released
  }
}
    `;

export function useVersionsQuery(options: Omit<Urql.UseQueryArgs<VersionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<VersionsQuery>({ query: VersionsDocument, ...options });
};
export const TracksDocument = gql`
    query Tracks($release_id: ID!) {
  tracks(release_id: $release_id) {
    title
    duration
    position
  }
}
    `;

export function useTracksQuery(options: Omit<Urql.UseQueryArgs<TracksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TracksQuery>({ query: TracksDocument, ...options });
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