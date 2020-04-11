import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
import {SpreadsheetClient} from "./SpreadsheetClient";
import {GoogleCalendar} from "./GoogleCalendar";

/**
 * 時刻トリガーで使う関数.
 * この関数を GAS の時刻トリガからフックする.
 * もし当日が営業日(土日祝日でない)なら 9:15 に Slack に POST する.
 */
export function setTrigger(): void {
    const today = new Date();
    if (GoogleCalendar.isBusinessDay(today)) {
        today.setHours(9);
        today.setMinutes(15);
        ScriptApp
            .newTrigger("postToSlack")
            .timeBased()
            .at(today)
            .create();
    }
}

/**
 * Slack に投稿をする関数.
 * ScriptApp.newTrigger(関数名) のかたちでコールされることを想定.
 */
export function postToSlack(): void {
    const slackUrl = PropertiesService.getScriptProperties().getProperty("SLACK_URL")
    const params: URLFetchRequestOptions = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
            text: SpreadsheetClient.getNextPersonInCharge()
        })
    };
    UrlFetchApp.fetch(slackUrl, params);
}
