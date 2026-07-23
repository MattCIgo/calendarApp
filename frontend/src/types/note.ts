
export default interface Note {
  [key: number]: any; // needed for typescript indexing ( need string or number etc???)
  pk: number,
  model: string,
  fields: {
    user_id: number,
    message: string,
    date_created: Date,
    date: Date,
  }
}