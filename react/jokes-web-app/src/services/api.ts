import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'jokesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.chucknorris.io/jokes' }),
    endpoints: (builder) => ({
        getRandomJoke: builder.query<JokeType, void>({
            query: () => `/random`,
        }),
    }),
});

export const {
    useGetRandomJokeQuery,
} = api;


export type JokeType = {
    categories: string[];
    created_at: string;
    icon_url: string;
    id: string;
    updated_at: string;
    url: string;
    value: string;
}