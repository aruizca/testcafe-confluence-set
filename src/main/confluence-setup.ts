import { ClientFunction, fixture, Selector } from 'testcafe';

const CONFIG = {
  BASE_URL: process.env.PPTR_CONFLUENCE_BASE_URL || 'http://confluence:8090/confluence',
  CONFLUENCE_LICENSE:
    process.env.PPTR_CONFLUENCE_LICENSE ||
    `AAABlQ0ODAoPeNptkV1vmzAUhu/9KyztZrugMpBkJZKlZcAWJEiWhW2qlBvXOwS3xma2IaW/fhQaq ZMm+cY+R37ej3dl3eGCDZgsMSHrkKwXCxwnJQ5IEKBHGH6CsUIr6q8I+Uhuw9BHu665B7OvfthxR n1CUKyVY9ztWAN007aVMIBL4LXSUp8FWJznMeJaVTfjluiBOtMB+tYZXjMLCXNAX3geCT0/QLngo CykT60wwzTslBSNcPD7SkoLJiRlnOtOOduygd1L+MRm9A3XDZLzJ1tma1rEl/hL8pCsos/i68O5e CpSv3SXxyy6pL+ScL+pD+3dn22/YrsoP8A2enb+QfdRtr1z8nCiJ4pGnnKgmOJvdY2iQ4/4nr+c3 R0dMw4MrZi0cPWRJTTPkmO68/xwEd2SRYDGC/3nYW/OTAnL3EvU/00wUxzFBqaNN4EtxzOzX2nl0 MLUQ7wvivR7nG3yaxbXKgOUgOVGtBNtTLSSHYzG8PsjmB7MBzx2iqd2T2sc66YBwwWT+BWB0p7Jb tY6O/0LJs/CLDAtAhUAjaBXSxbSxugiFDveN2w5Kc8nZTICFBXOBgbyE/cGG0btPFo+tfGUlJjjX 02jj`,
  DB_USER: process.env.PPTR_DB_USER || 'postgres',
  DB_PASSWORD: process.env.PPTR_DB_PASSWORD || 'postgres',
  DB_JDBC_URL: process.env.PPTR_JDBC_URL || 'jdbc:postgresql://postgres:5432/confluence',
};

const ADMIN_USER = {
  username: 'admin',
  password: 'admin',
  fullname: 'Mr admin',
  email: 'admin@whatever.com',
};

const getLocation = ClientFunction(() => document.location.href);

fixture('Confluence Unsupervised Setup');

test('Confluence Unsupervised Setup:', async t => {
  // Select Installation Type
  console.log('- Installation Type as PROD');
  await t
    .navigateTo(`${CONFIG.BASE_URL}/setup/setupstart.action`) //
    .click('#custom')
    .click('#setup-next-button');

  // Get apps
  if ((await getLocation()) === `${CONFIG.BASE_URL}/setup/selectbundle.action`) {
    await t.click('#setup-next-button');
  }

  // Add License
  await t.expect(await getLocation()).eql(`${CONFIG.BASE_URL}/setup/setuplicense.action`);
  console.log('- License Setup');
  await t
    .typeText('#confLicenseString', CONFIG.CONFLUENCE_LICENSE, { paste: true }) //
    .click('#setupTypeCustom');

  // Configure Database
  await t.expect(await getLocation()).eql(`${CONFIG.BASE_URL}/setup/setupdbchoice-start.action`);
  console.log('- Configure Database');
  await t
    .click('#custom') //
    .click('#setup-next-button');
  // Next sub-screen
  await t
    .click('#dbConfigInfo-customize + span + label')
    .typeText('#dbConfigInfo-databaseUrl', CONFIG.DB_JDBC_URL, { paste: true, replace: true })
    .typeText('#dbConfigInfo-username', CONFIG.DB_USER, { paste: true })
    .typeText('#dbConfigInfo-password', CONFIG.DB_PASSWORD, { paste: true })
    .click('#setup-next-button');

  // Setup Admins User
  const formButton = Selector('#blankChoiceForm > input[type=submit]', { timeout: 120000 });
  console.log('- Setup Admin User ');
  await t.click(formButton);

  await t.expect(await getLocation()).eql(`${CONFIG.BASE_URL}/setup/setupusermanagementchoice-start.action`);
  await t.click('#internal');

  await t.expect(await getLocation()).eql(`${CONFIG.BASE_URL}/setup/setupadministrator-start.action`);
  await t
    .typeText('#fullName', ADMIN_USER.fullname, { paste: true })
    .typeText('#email', ADMIN_USER.email, { paste: true })
    .typeText('#password', ADMIN_USER.password, { paste: true })
    .typeText('#confirm', ADMIN_USER.password, { paste: true })
    .click('#setup-next-button');

  // Admin settings - disable Confluence onboarding module
  console.log(`- Disable Confluence Onboarding Module`);
  await t
    .click('#further-configuration') //
    .typeText('#password', ADMIN_USER.password, { paste: true })
    .click('#authenticateButton')
    .navigateTo(`${CONFIG.BASE_URL}/plugins/servlet/upm/manage/system`)
    .click('#upm-manage-filter-box')
    .typeText('#upm-manage-filter-box', 'onboarding', { paste: true, replace: true })
    .click('div[data-key="com.atlassian.confluence.plugins.confluence-onboarding"]')
    .click('a.aui-button[data-action="DISABLE"]');

  // Admin settings - set Confluence path to localhost
  // if (!CONFIG.BASE_URL.includes('localhost')) {
  //   const baseUrl = CONFIG.BASE_URL.replace(/(http[s]?:\/\/)(.*)(:.*)/g, '$1localhost$3');
  //   console.log(`- Setting Confluence base url to: ${baseUrl}`);
  //   await t
  //     .navigateTo(`${CONFIG.BASE_URL}/admin/editgeneralconfig.action`) //
  //     .typeText('#editbaseurl', baseUrl, { paste: true, replace: true });
  //
  //   const submitButton = Selector('#confirm');
  //   await t.scrollIntoView(submitButton).wait(2000).click(submitButton).wait(3000);
  //   await t.expect(await getLocation()).eql(`${baseUrl}/admin/viewgeneralconfig.action`);
  // }
});
