import http from "k6/http";
import { sleep } from "k6";
import { url } from "./config.js";

// レギュレーションで GET /initialize のレスポンスは10秒以内である必要があるためタイムアウトを10秒にする
export default function () {
  http.get(url("/initialize"), {
    timeout: "10s",
  });
  sleep(1);
}
