import { gql } from "@apollo/client";
export const GET_WEATHER_QUERY = gql`
query getEpsodesByName($name: String!) {
    getEpsodesName(name: $name) {
      name
      characters {
        results {
          id
          name
          image
          gender
        }
      }

`
