import { productDescription } from "@spaceobject/core";

export default {
  fetch() {
    return new Response(productDescription);
  },
};
