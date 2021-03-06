import accountIssues from '../helpers/accountIssues'

export const currentUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      {
        return {
          ...state,  
            ...action.currentUser,
            notifications: accountIssues(action.currentUser.validated,action.currentUser.account_complete)
          }
      }
    default:
      return state;
  }
};