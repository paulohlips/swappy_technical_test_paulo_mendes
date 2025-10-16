import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'jokesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:3000' }),
    endpoints: (builder) => ({
        getRandomJoke: builder.query<JokeType, void>({
            query: () => `/joke`,
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