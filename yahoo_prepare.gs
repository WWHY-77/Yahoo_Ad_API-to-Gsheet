
//Yahoo　APIを利用するために必要な手順
//https://ads-developers.yahoo.co.jp/developercenter/ja/startup-guide/api-call.html
//1. ACCESS TOKEN...有効期限：1時間
//2. REFRESH TOKEN...有効期限：ユーザーが当該アプリケーションの承認を解除するまで有効です。

const CLIENT_ID =
  "YOUR_CLIENT_ID";
const CLIENT_SECRET =
  "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "https://qiita.com";

let REFRESH_TOKEN =
  "YOUR_REFRESH_TOKEN";
const ACCESS_TOKEN = getAccessToken();
Logger.log(ACCESS_TOKEN);

const ACCOUNT_ID = "YOUR_ACCOUNT_ID";

function getJSON(url) {
  const options = {
    method: "get",
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response);
  return json;
}

function getUrlforAuthCode() {
  const url = `https://biz-oauth.yahoo.co.jp/oauth/v1/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=yahooads`;
  Logger.log(url);
}

const AUTH_CODE = "YOUR_AUTH_CODE";

function getRefreshToken(AUTH_CODE) {
  const url = `https://biz-oauth.yahoo.co.jp/oauth/v1/token?grant_type=authorization_code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${AUTH_CODE}`;
  const json = getJSON(url);
  return json.refresh_token;
}

function getAccessToken() {
  if (REFRESH_TOKEN == null) {
    REFRESH_TOKEN = getRefreshToken(AUTH_CODE);
  }
  const url = `https://biz-oauth.yahoo.co.jp/oauth/v1/token?grant_type=refresh_token&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${REFRESH_TOKEN}`;
  const json = getJSON(url);
  return json.access_token;
}

