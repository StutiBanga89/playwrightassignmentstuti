import { expect, type Page } from '@playwright/test';
//import * as path from 'node:path';

export class RecruitmentPage {
    private readonly page: Page;
    private readonly recruitmentMenu;
    private readonly addButton;
    private readonly addCandidateHeading;
    private readonly recruitmentHeading;
    private readonly firstNameField;
    private readonly lastNameField;
    private readonly jobVacancySelect;
    private readonly emailField;
    private readonly contactField;
    private readonly browseResumeButton;
    private readonly keywordsField;
    private readonly saveButton;
    private readonly candidatesLink;
    private readonly candidateSearchField;
    private readonly searchButton;
    private readonly rejectButton;
    private readonly rejectHeading;
    private readonly rejectSaveButton;
    private readonly ConsentCheckbox;
    private readonly ConsentCheckboxa;
    private readonly resumeFileInput;
    private readonly applicationStageHeading;
    private readonly applicationStatusLabel;
    private readonly candidatesHeading;

    constructor(page: Page) {
        this.page = page;
        this.recruitmentMenu = page.getByRole('link', { name: 'Recruitment' });
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.addCandidateHeading = page.getByRole('heading', { name: 'Add Candidate' });
        this.recruitmentHeading = page.getByRole('heading', { name: 'Recruitment' });
        this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
        this.jobVacancySelect = page.getByText('-- Select --');
        this.emailField = page.getByRole('textbox', { name: 'Type here' }).first();
        this.contactField = page.getByRole('textbox', { name: 'Type here' }).nth(1);
        this.browseResumeButton = page.getByText('Browse');
        this.keywordsField = page.getByRole('textbox', { name: 'Enter comma seperated words...' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.candidatesLink = page.getByRole('link', { name: 'Candidates' });
        this.candidateSearchField = page.getByRole('textbox', { name: 'Type for hints...' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.rejectButton = page.getByRole('button', { name: 'Reject' });
        this.rejectHeading = page.getByRole('heading', { name: 'Reject Candidate' });
        this.rejectSaveButton = page.getByRole('button', { name: 'Save' });
        this.ConsentCheckbox = page.getByText('Consent to keep data');
        this.ConsentCheckboxa = page.locator('.oxd-icon.bi-check');
        this.resumeFileInput = page.locator('input[type="file"]');
        this.applicationStageHeading = page.getByRole('heading', { name: 'Application Stage' });
        this.applicationStatusLabel = page.getByText(/Application Initiated|Status:/i);
        this.candidatesHeading = page.getByRole('heading', { name: 'Candidates' });
    }

    async goto(url = 'https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates') {
        await this.page.goto(url);
    }

    async openRecruitmentMenu(): Promise<void> {
        await this.recruitmentMenu.click();
    }

    async expectRecruitmentVisible(): Promise<void> {
        await expect(this.recruitmentHeading).toBeVisible();
    }

    async clickAddCandidate(): Promise<void> {
        await this.addButton.click();
    }

    async expectAddCandidateVisible(): Promise<void> {
        await expect(this.addCandidateHeading).toBeVisible();
    }

    async setFirstName(name: string): Promise<void> {
        await this.firstNameField.fill(name);
    }

    async setLastName(name: string): Promise<void> {
        await this.lastNameField.fill(name);
    }

    async selectJobVacancy(vacancy: string): Promise<void> {
        await this.jobVacancySelect.click();
        await this.page.getByText(new RegExp(vacancy, 'i')).click();
    }

    async setEmail(email: string): Promise<void> {
        await this.emailField.fill(email);
    }

    async expectEmailValue(email: string): Promise<void> {
        await expect(this.emailField).toHaveValue(email);
    }

    async setContactNumber(contact: string): Promise<void> {
        await this.contactField.fill(contact);
    }

    async expectContactValue(contact: string): Promise<void> {
        await expect(this.contactField).toHaveValue(contact);
    }

    async setKeywords(keywords: string): Promise<void> {
        await this.keywordsField.fill(keywords);
    }

    async clickSave(): Promise<void> {
        await this.saveButton.click();
    }

    async expectApplicationInitiated(): Promise<void> {
        // Wait for navigation to the created candidate page
        await this.page.waitForURL(/.*\/recruitment\/addCandidate\/[0-9]+/, { timeout: 30000 });
        // Prefer a stable page marker: the "Application Stage" heading is reliable.
        // If not present, fall back to checking for a status label.
        try {
            await expect(this.applicationStageHeading).toBeVisible({ timeout: 30000 });
            await expect(this.applicationStatusLabel).toBeVisible({ timeout: 5000 });

        } catch (e) {
            // If the heading is not found, check for the status label as a fallback
            await expect(this.page.getByText(/Status:/i)).toBeVisible({ timeout: 30000 });
        }
    }

    async AddNewCandidate(candidate: {
        firstName: string;
        lastName: string;
        vacancy: string;
        email: string;
        contact: string;
        keywords: string;
    }): Promise<void> {
        await this.recruitmentMenu.click();
        await this.expectRecruitmentVisible();
        await this.clickAddCandidate();
        await this.expectAddCandidateVisible();
        await this.setFirstName(candidate.firstName);
        await this.setLastName(candidate.lastName);
        await this.selectJobVacancy(candidate.vacancy);
        await this.setEmail(candidate.email);
        await this.expectEmailValue(candidate.email);
        await this.setContactNumber(candidate.contact);
        await this.expectContactValue(candidate.contact);
        const resumePath = 'C:\\Users\\stuti01\\PlaywrightAssignmentStuti\\test-data\\Test.docx';
        console.log("Resume Path: ", resumePath);
        await this.resumeFileInput.setInputFiles(resumePath);
        // After uploading a file some apps show an upload/confirmation popup.
        // Wait briefly for any dialog and try to close it; fall back to Escape key.
        try {
            const uploadDialog = this.page.locator('div[role="dialog"], .oxd-dialog, .modal, .upload-dialog').first();
            await uploadDialog.waitFor({ state: 'visible', timeout: 5000 });
            const closeBtn = uploadDialog.locator('button:has-text("Close"), button:has-text("OK"), button[aria-label="Close"], button:has-text("Cancel"), .oxd-icon.bi-times');
            if (await closeBtn.count() > 0) {
                await closeBtn.first().click();
            } else {
                await this.page.keyboard.press('Escape');
            }
        } catch (e) {
            // no upload dialog appeared — continue
        }
        await this.ConsentCheckboxa.click();
        await this.saveButton.click();
        await this.expectApplicationInitiated();
    }



    async rejectCandidate(): Promise<void> {
        await expect(this.rejectButton).toBeVisible();
        await this.rejectButton.click();
        await this.page.waitForSelector('h6:has-text("Reject Candidate")', { timeout: 30000 });
        await expect(this.rejectHeading).toBeVisible();
        await this.rejectSaveButton.click();
        await this.page.waitForTimeout(5000);
        console.log("Candidate Rejected by clicking button Reject")
        await expect(this.page.getByText('Status: Rejected')).toBeVisible();
    }
    async verifyCandidateVisible(fullname: string, fName: string): Promise<void> {
        await this.recruitmentMenu.click();
        await expect(this.candidatesHeading).toBeVisible();
        console.log("Searching for candidate: ", fName, " with full name: ", fullname);
        await this.candidateSearchField.fill(fName);
        await this.candidateSearchField.click();
        const suggestionOption = this.page.getByRole('option', { name: fullname });
        await suggestionOption.waitFor({ state: 'visible', timeout: 10000 });
        await suggestionOption.click();
        await this.searchButton.click();
        await expect(this.page.getByText(fullname)).toBeVisible();
    }
}
