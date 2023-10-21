import http from "k6/http";
import { check } from "k6";
import { url } from "./config.js";
import { parseHTML } from "k6/html";

// ログインしてコメントを投稿する
export default function () {
  // /loginに対しアカウントとパスワードを送信
  const login_res = http.post(url("/login"), {
    account_name: "kona",
    password: "konakona",
  });

  check(login_res, {
    "is status 200": (r) => r.status === 200,
  });

  // ユーザページを取得
  const res = http.get(url("/@kona"));
  const doc = parseHTML(res.body);

  //csrf_token, post_idを抽出
  const token = doc.find('input[name="csrf_token"]').first().attr("value");
  const post_id = doc.find('input[name="post_id"]').first().attr("value");

  // /commentに対しpost_id, csrf_token, コメント本文をPOST
  const comment_res = http.post(url("/comment"), {
    post_id: post_id,
    csrf_token: token,
    comment: "Hello k6!",
  });
  check(comment_res, {
    "is status 200": (r) => r.status === 200,
  });
}
