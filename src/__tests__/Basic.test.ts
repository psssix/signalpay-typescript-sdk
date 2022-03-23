import { ApiClient } from "../index";

test("ApiService", () => {
  expect(new ApiClient("test")).toBeInstanceOf(ApiClient);
});
