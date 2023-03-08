export const REQUEST_ROUTES = {
  ADMIN_LOGIN: 'userLogins/validateCred',
  CLIENT_LOGIN: 'clientProfiles/validateCred',
  CAPTCHA_VALIDATE: 'clientProfiles/validateCaptchaResponse',
  REGISTER: 'clientProfiles/register',
  SUBSCRIPTION_PLANS: 'subscriptionsplans',
  REQUEST_PASSWORD_CHANGE: 'clientProfiles/resetPass',
  CHANGE_PASSWORD: 'clientProfiles/changePass',
  CHECK_RESET_LINK: 'clientProfiles/checkResetPassLink',
  CLIENT_PROFILE: 'clientProfiles/',

  CLIENT_PROFILE_COMPANY_NAME: 'clientProfiles/companyName',
  NOTIFY_ADMIN: 'clientProfiles/notifyAdmin',
  ALL_SETTING: 'googleMicroAuthSettings/allSettings',
  SUBSCRIPTION_LIST: 'subscriptionsplans',

  SUBSCRIPTION_ACTIVE_FREE: 'subscriptionsallocation/activateTrail/',
  SUBSCRIPTION_PAYMENT_URL: 'subscriptionsallocation/getPaymentUrl',
  SUBSCRIPTION_STATUS: 'subscriptionsallocation/verifyTransaction',
  SUBSCRIPTION_ACTIVE_GET: 'subscriptionsallocation/getActivePlan/',
  USER_APPROVED_OR_NOT: 'subscriptionsallocation/isUserApproved/',

  DATA_LOAD_PROCESS: 'subscriptionsallocation/checkDataLoadProcess/',

  ACCESS_TOKEN: 'xerotokenaccess/',

  XERO_AUTH_URL_GET: 'xerotokenaccess/authLink/',

  REPORT_ALLOCATION_LIST: 'clientReportAllocation/reportList',

  GET_REPORT: 'clientReportAllocation/getEmbedReport',
  GET_LOGS_STATUS: 'subscriptionsallocation/getJobsDetails/',
  PAGE_VISUALS: 'pageVisuals',

  CONVERSIONS : 'clientUserMessages/',
  CONVERSIONS_MESAGE_BU_ID : 'clientUserMessages/messageDetails/',


  IS_ADVISER_ACTIVE : 'clientProfiles/activateAsAdvisor/',


  GET_USERS: 'clientUsersList',
  
  GET_VISUALS: 'visualsList/',
};
