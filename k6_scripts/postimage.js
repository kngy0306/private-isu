import http from 'k6/http';
import { url } from "./config.js";
import { parseHTML } from "k6/html";

const testImage = open("testImage.png", "b");

// ログインして画像を投稿するシナリオ
export default function () {
  const res = http.post(url("/login"), {
    account_name: "kona",
    password: "konakona",
  });

  const doc = parseHTML(res.body);
  const token = doc.find('input[name="csrf_token"]').first().attr("value");

  http.post(url("/"), {
    // http.fileでファイルアップロードを行う
    file: http.file(testImage, "testImage.png", "image/png"),
    body: "posted by k6",
    csrf_token: token,
  });
}
