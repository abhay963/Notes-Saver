import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const initialState = {
  pastes: localStorage.getItem("pastes")
    ? JSON.parse(localStorage.getItem("pastes"))
    : [],
};

export const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    addToPaste: (state, action) => {
      const paste = action.payload;

      const alreadyExists = state.pastes.some((p) =>
        p.title === paste.title &&
        p.content === paste.content &&
        p._id !== paste._id // ✅ Don't consider the current editing paste as duplicate
      );

      if (alreadyExists) {
        toast.error("Paste already exists!");
        return;
      }

      state.pastes.unshift(paste); // Add to top
      localStorage.setItem("pastes", JSON.stringify(state.pastes));
      
    },

updateToPastes: (state, action) => {
  const paste = action.payload;
  const index = state.pastes.findIndex((item) => item._id === paste._id);

  if (index >= 0) {
    // Remove and re-add at top
    state.pastes.splice(index, 1);
    state.pastes.unshift(paste);

    localStorage.setItem("pastes", JSON.stringify(state.pastes));
   
  } else {
    toast.error("Paste not found");
  }
},


    removeFromPastes: (state, action) => {
      const pasteId = action.payload;
      const index = state.pastes.findIndex((item) => item._id === pasteId);

      if (index >= 0) {
        state.pastes.splice(index, 1);
        localStorage.setItem("pastes", JSON.stringify(state.pastes));
        toast.success("Paste deleted");
      }
    },

    resetAllPastes: (state) => {
      state.pastes = [];
      localStorage.removeItem("pastes");
      toast.success("All pastes removed");
    },
  },
});

export const {
  addToPaste,
  updateToPastes,
  resetAllPastes,
  removeFromPastes,
} = pasteSlice.actions;

export default pasteSlice.reducer;
