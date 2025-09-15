import { apiInitializer } from "discourse/lib/api";

export default apiInitializer((api) => {
  console.log("Current user is", api.getCurrentUser());
});