import * as Yup from 'yup';

export const inputCategorySchema = Yup.object({
  name: Yup.string()
    .required('Category name is required')
    .matches(/^[a-zA-Z\s]+$/, 'Category must contain only letters'),
});
