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
};


export type QueryMastersArgs = {
  search: Scalars['String'];
};

export type Master = {
  __typename?: 'Master';
  title: Scalars['String'];
  id: Scalars['ID'];
  thumb?: Maybe<Scalars['String']>;
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
    & Pick<Master, 'title' | 'id' | 'thumb'>
  )> }
);


export const SearchQueryDocument = gql`
    query SearchQuery($search: String!) {
  masters(search: $search) {
    title
    id
    thumb
  }
}
    `;

export function useSearchQueryQuery(options: Omit<Urql.UseQueryArgs<SearchQueryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchQueryQuery>({ query: SearchQueryDocument, ...options });
};