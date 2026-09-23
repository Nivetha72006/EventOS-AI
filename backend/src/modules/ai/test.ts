import "dotenv/config";

import gemini from "./services/gemini.service";

async function test() {
  const response = await gemini.generate("Say Hello");
  console.log(response);
}

test();