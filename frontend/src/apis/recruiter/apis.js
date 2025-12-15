
import api from '../api'

const createRecruiter = async (payload)=> {

    const response = await api.post(
      "/v1/recruiter/profile/draft/create/",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response


}

export {
    createRecruiter
}