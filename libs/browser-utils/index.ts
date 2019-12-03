import { useState, Dispatch, SetStateAction } from "react"

export const useFormFields: <T>(f: T) => [T, (key: keyof T) => (e: { target: { value: any } }) => void, Dispatch<SetStateAction<T>>] = <T>(_fields: T) => {
  const [fields, setFields] = useState(_fields)
  const saveField = (key: keyof T) => (e: any) => {
    setFields({
      ...fields,
      [key]: e.target.value
    })
  }
  return [fields, saveField, setFields]
}
