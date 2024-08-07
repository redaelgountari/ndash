
import * as yup from 'yup';

export const userSchema = yup.object().shape({
Tracking_ID_CD: yup.string().required('Tracking_ID_CD is required'),

});
