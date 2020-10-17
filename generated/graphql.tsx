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
  choices?: Maybe<Choices>;
};


export type QueryMastersArgs = {
  search: Scalars['String'];
};


export type QueryChoicesArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type Master = {
  __typename?: 'Master';
  title: Scalars['String'];
  id: Scalars['ID'];
  cover_image?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
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