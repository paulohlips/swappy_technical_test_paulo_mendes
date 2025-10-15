import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'jokesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.chucknorris.io/jokes' }),
    endpoints: (builder) => ({
        getJokesCategories: builder.query<JokeCategory[], void>({
            query: () => '/categories',
        }),
        getRandomJoke: builder.query<Joke, void>({
            query: () => `/random`,
        }),
    }),
});

export const {
    useGetJokesCategoriesQuery,
    useGetRandomJokeQuery,
} = api;

export type JokeCategory = string[];

export type Joke = {
    categories: string[];
    created_at: string;
    icon_url: string;
    id: string;
    updated_at: string;
    url: string;
    value: string;
}