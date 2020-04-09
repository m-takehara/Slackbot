import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const SPREADSHEET_ID = "1YkiC6SaxaDS0uGxcZnIYE-s-SsmT3pekROrqAgWcnb4";

export class SpreadsheetClient {
    public static getPersonInCharge(): string {
        const pic: Object[][] = this.getSpreadsheetValues();

        const mc = pic.filter(v => v[1] === 'mc')[0][0];
        return `本日の DailyScrum 司会は ${mc} さんです!`;
    }

    public static getNextPersonInCharge(): string {
        this.shiftNextRole();
        return this.getPersonInCharge();
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

    private static setSpreadsheetValue(a1notation: string, value: string): void {
        this.getSpreadsheet().getRange(a1notation).setValue(value);
    }

    private static shiftNextRole(): void {
        const values = this.getSpreadsheetValues();

        const facilitatorNumber = values.indexOf(values.filter(v => v[1] === 'mc')[0]) + 1;
        this.setSpreadsheetValue(`B${facilitatorNumber}`, '');

        const nextFacilitatorNumber = facilitatorNumber % values.length + 1;
        this.setSpreadsheetValue(`B${nextFacilitatorNumber}`, 'mc');
    }
}
