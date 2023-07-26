interface State {
    app: {
        isAuth: boolean
    }
}
export const authSelector = (state: State) => state.app.isAuth;
