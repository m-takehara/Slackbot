import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
const ROLE_ROW = "B";
const FACILITATOR_KEY = 'facilitator';

export class GoogleSpreadsheet {
    public static getCurrentFacilitator(): string {
        return <string>this.getSpreadsheetValues()
            .filter(v => v[1] === FACILITATOR_KEY)[0][0];
    }

    public static getNextFacilitator(): string {
        this.shiftRoleToNextPerson();
        return this.getCurrentFacilitator();
    }

    private static getSpreadsheet(): Sheet {
        return SpreadsheetApp
            .openById(SPREADSHEET_ID)
            .getActiveSheet();
    }

    private static getSpreadsheetValues(): Object[][] {
        return this.getSpreadsheet()
            .getDataRange()
            .getValues();
    }

    private static setSpreadsheetValue(row: string, line: number, value: string): void {
        this.getSpreadsheet()
            .getRange(`${row}${line}`)
            .setValue(value);
    }

    private static shiftRoleToNextPerson(): void {
        const values = this.getSpreadsheetValues();

        const currentLine = 1 + values.indexOf(values.filter(v => v[1] === FACILITATOR_KEY)[0]);
        this.setSpreadsheetValue(ROLE_ROW, currentLine, '');

        const nextLine = currentLine % values.length + 1;
        this.setSpreadsheetValue(ROLE_ROW, nextLine, FACILITATOR_KEY);
    }
}
