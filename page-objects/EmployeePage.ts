import { expect, type Page } from '@playwright/test';

export type EmployeeData = {
	firstName: string;
	middleName?: string;
	lastName: string;
	empNumber: string;
	fullName: string;
	username: string;
	password: string;
};

export class EmployeePage {
	private readonly page: Page;
	private readonly pimLink;
	private readonly addButton;
	private readonly firstNameField;
	private readonly middleNameField;
	private readonly lastNameField;
	private readonly addEmployeeHeading;
	private readonly saveButton;
	private readonly personalDetailsHeading;
	private readonly employeeIdField;
	private readonly switchInput;
	private readonly usernameField;
	private readonly passwordField;
	private readonly confirmPasswordField;
    private readonly successMessage;

	constructor(page: Page) {
		this.page = page;
		this.pimLink = page.getByRole('link', { name: 'PIM' });
		this.addButton = page.getByRole('button', { name: ' Add' });
		this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
		this.middleNameField = page.getByRole('textbox', { name: 'Middle Name' });
		this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
		this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
		this.saveButton = page.getByRole('button', { name: 'Save' });
		this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
		this.employeeIdField = page.getByRole('textbox').nth(4);
		this.switchInput = page.locator('.oxd-switch-input');
		this.usernameField = page.getByRole('textbox').nth(5);
		this.passwordField = page.locator('input[type="password"]').first();
        this.successMessage = this.page.getByText(/Successfully Saved/i);
		this.confirmPasswordField = page.locator('input[type="password"]').nth(1);
	}

	async openPIM(): Promise<void> {
		await this.pimLink.click();
	}

	async clickAdd(): Promise<void> {
		await this.addButton.click();
	}

	async setFirstName(name: string): Promise<void> {
		await this.firstNameField.click();
		await this.firstNameField.fill(name);
	}

	async setMiddleName(name: string): Promise<void> {
		await this.middleNameField.click();
		await this.middleNameField.fill(name);
	}

	async setLastName(name: string): Promise<void> {
		await this.lastNameField.click();
		await this.lastNameField.fill(name);
	}

	async expectAddEmployeeVisible(): Promise<void> {
		await expect(this.addEmployeeHeading).toBeVisible();
	}

	async clickSave(): Promise<void> {
		await this.saveButton.click();
	}
    async gotoPersonalDetails(empNumber: string): Promise<void> {
		await this.page.goto(`https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
	}

	async expectPersonalDetailsVisible(): Promise<void> {
		await expect(this.personalDetailsHeading).toBeVisible();
	}

	async expectEmployeeNameVisible(fullName: string): Promise<void> {
		await expect(this.page.getByRole('heading', { name: fullName })).toBeVisible({ timeout: 30000 });
	}

	/**
	 * Perform the full add-employee flow and optionally navigate to personal details
	 * firstName: first name to enter
	 * middleName: optional middle name (pass empty string to skip)
	 * lastName: last name to enter
	 * empNumber: optional employee number to navigate to personal details
	 * fullName: optional full name to assert visible on personal details page
	 */
	async addEmployeeAndVerify(employee: EmployeeData): Promise<void> {
		await this.openPIM();
		await this.clickAdd();
		await this.expectAddEmployeeVisible();
		await this.setFirstName(employee.firstName);
		if (employee.middleName && employee.middleName.length > 0) {
			await this.setMiddleName(employee.middleName);
		}
		await this.setLastName(employee.lastName);
		await this.employeeIdField.click();
		await this.employeeIdField.fill(employee.empNumber);
		await this.switchInput.click();
		await this.usernameField.click();
		await this.usernameField.fill(employee.firstName+"_ "+employee.lastName);
		await this.passwordField.click();
		await this.passwordField.fill(employee.password);
		await this.confirmPasswordField.click();
		await this.confirmPasswordField.fill(employee.password);
		await this.clickSave();
        await expect(this.successMessage).toBeVisible();
		await this.expectPersonalDetailsVisible();
                await this.page.waitForTimeout(5000); // Wait for 2 seconds to ensure the page has fully loaded

       await this.expectEmployeeNameVisible(employee.fullName);
       
	
	}

	
}
