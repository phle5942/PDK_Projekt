const { name_to_id } = require("../src/name_to_id");

test("name_to_id finds Pirates", async () => {
  const r = await name_to_id("spider-man");
  expect(r).toBeDefined();
  expect(r!.movie_title.toLowerCase()).toContain("");
  console.log(r);
});
