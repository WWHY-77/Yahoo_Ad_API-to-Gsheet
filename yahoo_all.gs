const url_search = "https://ads-search.yahooapis.jp/api/v3";

const spreadsheet = SpreadsheetApp.getActive();
const sheet = spreadsheet.getSheetByName("YOUR_SHEET_NAME");

function getSearchAd() {
  const report_job_id = getReportJobId();
  if (report_job_id) {
    const values_2D = getReport(report_job_id);
    const values = values_2D.map((array) => array[1]).slice(1,-1);//titleと集計の削除
    const data = values.map(element=>[element])
    
    const row_2days_ago = sheet
      .getRange(1, 13)
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow();
    sheet
      .getRange(row_2days_ago-5, 13, data.length)
      .setValues(data);
  }
}

function getReportJobId() {
  const payload = {
    accountId: yahoo_ACCOUNT_ID,
    operand: [
      {
        accountId: yahoo_ACCOUNT_ID,
        fields: ["DAY", "COST"],
        reportCompressType: "NONE",
        reportDateRangeType: "LAST_7_DAYS",
        reportDownloadEncode: "UTF-8",
        reportDownloadFormat: "CSV",
        reportIncludeDeleted: "TRUE",
        reportLanguage: "JA",
        reportName: "スプレッドシート出力用レポート",
        reportType: "ACCOUNT",
        sortFields: [{ field: "DAY", reportSortType: "ASC" }],
      },
    ],
  };

  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + yahoo_ACCESS_TOKEN },
    muteHttpExceptions: true,
    payload: JSON.stringify(payload),
    contentType: "application/json",
  };

  const response = UrlFetchApp.fetch(
    url_search + "/ReportDefinitionService/add",
    options
  );

  const json = JSON.parse(response);
  const REPORT_JOB_ID = json.rval.values[0].reportDefinition.reportJobId;

  return REPORT_JOB_ID
}

function getReport(REPORT_JOB_ID) {
  const payload = {
    accountId: yahoo_ACCOUNT_ID,
    reportJobId: REPORT_JOB_ID,
  };
  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + yahoo_ACCESS_TOKEN },
    muteHttpExceptions: true,
    payload: JSON.stringify(payload),
    contentType: "application/json",
  };

  let report_progression = 1;
  while(report_progression != null){
    var response = UrlFetchApp.fetch(
    url_search + "/ReportDefinitionService/download",
    options)
    try{
      var json = JSON.parse(response);
    }catch(e){
      break;
    }
    report_progression = json.errors;
  }
  
  var values_2D = Utilities.parseCsv(response);
  return values_2D;
}
