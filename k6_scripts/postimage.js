import http from 'k6/http';
import { url } from "./config.js";
import { parseHTML } from "k6/html";
import { getAccount } from "./accounts.js";

const testImage = open("testImage.png", "b");

// ログインして画像を投稿するシナリオ
export default function () {
  const account = getAccount();
  const res = http.post(url("/login"), {
    account_name: account.account_name,
    password: account.password,
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
