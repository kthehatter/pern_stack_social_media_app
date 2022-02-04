import {createSlice} from '@reduxjs/toolkit';

const initialState = {id: '',name: '',email: '',isLoggedIn: false,}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: initialState
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.value = action.payload;
        },
        userLogout: (state) => {
            state.value = initialState;
        }
    }
});

export const {setUserInfo,userLogout} = userSlice.actions;

export default userSlice.reducer;