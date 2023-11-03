import http from "k6/http";
import { check } from "k6";
import { url } from "./config.js";
import { parseHTML } from "k6/html";
import { getAccount } from "./accounts.js";

// ログインしてコメントを投稿する
export default function () {
  const account = getAccount();
  const login_res = http.post(url("/login"), {
    account_name: account.account_name,
    password: account.password,
  });

  check(login_res, {
    "/login is status 200": (r) => r.status === 200,
  });

  // ユーザページを取得
  const res = http.get(url(`/@${account.account_name}`));
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
    "/comment is status 200": (r) => r.status === 200,
  });
}
