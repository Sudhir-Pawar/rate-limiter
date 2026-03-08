import { USER_TIER } from "./enums/user-type";
import { RateLimiter } from "./RateLimiter";
import { SimpleRequest } from "./SimpleRequest";

function main() {
  const requests: SimpleRequest[] = [];

  for (let i = 0; i <= 10; i++) {
    requests.push(new SimpleRequest(USER_TIER.FREE, "100123", Date.now()));
  }

  const rateLimiter = new RateLimiter();
  requests.forEach(function (request) {
    console.log(rateLimiter.allowRequest(request));
  });
}

main();
