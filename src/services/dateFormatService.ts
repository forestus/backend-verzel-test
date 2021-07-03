import { ClassEntity } from '@models/ClassEntity';
import moment from 'moment';

async function formatDate(
  classAlreadyExists: Array<any> | any
): Promise<Array<any> | any> {
  if (classAlreadyExists instanceof ClassEntity) {
    return {
      ...classAlreadyExists,
      exhibition: moment(classAlreadyExists.exhibition, 'YYYY-MM-DDTHH:mm:ss')
        .format('YYYY-MM-DDTHH:mm:ss')
        .replace('T', ' ')
    };
  }
  const dateFormated = classAlreadyExists.map((clas) => {
    return {
      ...clas,
      exhibition: moment(clas.exhibition, 'YYYY-MM-DDTHH:mm:ss')
        .format('YYYY-MM-DDTHH:mm:ss')
        .replace('T', ' ')
    };
  });
  return dateFormated;
}
export { formatDate };
