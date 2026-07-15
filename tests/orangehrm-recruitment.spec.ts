import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { RecruitmentPage } from '../page-objects/RecruitmentPage.ts';
import { EmployeePage } from '../page-objects/EmployeePage';
import { loginData } from '../test-data/loginData';
import { candidateData } from '../test-data/candidateData';
import { employeeData } from '../test-data/employeeData';



test.describe('OrangeHRM Recruitment flows', () => {
  let loginPage: LoginPage;
  let recruitmentPage: RecruitmentPage;
  let employeePage: EmployeePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    recruitmentPage = new RecruitmentPage(page);
    employeePage = new EmployeePage(page);
    await loginPage.goto(loginData.url);
    await loginPage.login(loginData.username, loginData.password);
    await loginPage.expectDashboardVisible();
  });

  test('Should add a new candidate and reject with a single RecruitmentPage action', async () => {
    await recruitmentPage.AddNewCandidate(candidateData);
    await recruitmentPage.rejectCandidate();
  });

  test('Should view the candidate from RecruitmentPage action', async () => {
    console.log("Candidate full name: ", candidateData.fullName);
    console.log("Candidate first name: ", candidateData.firstName);
    await recruitmentPage.verifyCandidateVisible(candidateData.fullName, candidateData.firstName);
  });

  test.only('Should add an Employee', async () => {
    // Consolidated add-employee flow: opens PIM, fills names, saves, navigates and asserts
    await employeePage.addEmployeeAndVerify(employeeData);
  });
});


