import axios from "axios";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  detailsSuccess,
  getFailedTwo,
  getSubjectsSuccess,
  getSubDetailsSuccess,
  getSubDetailsRequest,
} from "./sclassSlice";

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const endpoint = `${process.env.REACT_APP_BASE_URL}/${address}/${id}`;
    // console.log("Fetching subjects from:", endpoint);
    const result = await axios.get(endpoint);

    console.log("API Response:", result.data);
    if (result.data.message) {
      console.warn("No subjects found:", result.data.message);
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    console.error("API Error:", error);
    dispatch(getError(error.message));
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());
  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}List/${id}`
    );
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/Sclass/Students/${id}`
    );
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getStudentsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
    );
    if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

// export const getSubjectList = (id, address) => async (dispatch) => {
//   dispatch(getRequest());

//   try {
//     const result = await axios.get(
//       `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
//     );
//     if (result.data.message) {
//       dispatch(getFailed(result.data.message));
//     } else {
//       dispatch(getSubjectsSuccess(result.data));
//     }
//   } catch (error) {
//     dispatch(getError(error));
//   }
// };

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/FreeSubjectList/${id}`
    );
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

// note this for deleting action
// I am telling you again --------------------------------------------------------------------------------------------

export const deleteClass = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/Sclass/${id}`);
  } catch (error) {
    throw error;
  }
};

export const deleteSubject = (id) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BASE_URL}/Subject/${id}`);
  } catch (error) {
    throw error;
  }
};

// export const getSubjectDetails = (id, address) => async (dispatch) => {
//   dispatch(getSubDetailsRequest());

//   try {
//     const result = await axios.get(
//       `${process.env.REACT_APP_BASE_URL}/${address}/${id}`
//     );
//     if (result.data) {
//       dispatch(getSubDetailsSuccess(result.data));
//     }
//   } catch (error) {
//     dispatch(getError(error));
//   }
// };
