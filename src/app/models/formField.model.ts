export interface FormValue {
  id: number;
  label: string;
  name: string;
}

export interface FormField {
  id: number;
  isRequired: boolean;
  label: string;
  maxLength?: number;
  minLength?: number;
  name: string;
  type?: string;
  value?: string;
  values?: FormValue[];
}
