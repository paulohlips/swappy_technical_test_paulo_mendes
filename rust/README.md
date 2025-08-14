# Rust joke API

AI tools allowed. If so, add a `AI.md` file with list of tools used.

Goal : Create a basic rust api that return a random joke (from a list of jokes or external API)

Mandatory : write test for at least one endpoint

Endpoints:

```
GET /joke
Return a random joke

200 :
{
    "joke": "Why did the chicken cross the road? To get to the other side."
}
```

```
GET /jooke
Return error (fixed body)

422 :
{
    "joke": "Who mispelled the api route ? You"
}
```
