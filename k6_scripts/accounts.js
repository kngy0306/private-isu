import { SharedArray } from "k6/data";

const accounts = new SharedArray('accounts', function() {
  return JSON.parse(open('./accounts.json'));
});

// ランダムに1アカウントを取得
export function getAccount() {
  return accounts[Math.floor(Math.random() * accounts.length)];
}
