export enum AuthRoutes {
  SignIn = '/auth/signIn',
  NotesSignIn = '/login',
  SignUp = '/auth/signUp',
  ConfirmEmail = '/users/confirm-email',
  ResendConfirmEmail = '/users/resend-confirmation-email',
  ConfirmTermsConditions = '/users/confirm-terms-conditions',
  CreateProfile = '/users/profile',
  DeleteNotesAccount = '/delete_account'
}

export enum ClientRoutes {
  GetPatients = '/patient/get',
  GetPatientsList = '/patient/get-minor',
  CreatePatient = '/patient/create',
  EditPatient = '/patient/edit'
}

export enum TherapistsRoutes {
  GetTherapists = '/therapist/get',
  CreateTherapist = '/therapist/create',
  ActivateTherapist = '/therapist/activate',
  EditTherapist = '/therapist/edit'
}

export enum SurveyRoutes {
  PostSurvey = '/survey/create',
  GetSurveys = '/survey/get',
  GetSurveysDetails = '/survey/details',
  GetSurvey = '/survey',
  DeleteSurvey = '/survey/delete',
  GetCategories = '/survey/category/get',
  PostCategory = '/survey/category/create',
  SendSurvey = '/survey/send',
  SendScheduleSurvey = '/survey/send-schedule',
  EditSurvey = '/survey/edit',
  PostClientResponse = '/survey/results',
}

