"use client";

import { cloneElement, DetailedHTMLProps, Dispatch, FormHTMLAttributes, memo, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Input from "./Input/Input";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import Textarea from "./Textarea/Textarea";
import CheckBox from "./CheckBox/CheckBox";

const formStatusSignal = signal<
  | {
      id: string;
      data: {
        id: string;
        errorMessage: string | null;
        placeholder: string;
        valueWithoutWhiteSpaces: boolean;
        valueToNumber: boolean;
        type: StringDataType | BooleanDataType;
        isValid: boolean;
        value: string | boolean;
        valueToLowerCase: boolean;
        name?: string;
        validateCallback: (
          id: string,
          value: string | boolean
        ) => Promise<{
          isValid: boolean;
          errorMessage: string | null;
        }>;
        formatting: ((value: string) => string) | undefined;
      }[];
    }[]
  | null
>(null);

const submitButtonSignal = signal<null | JSX.Element>(null);

const setErrorStatusToFormStatusField = async (
  setFormStatus: Dispatch<
    SetStateAction<
      {
        id: string;
        data: {
          id: string;
          errorMessage: string | null;
          placeholder: string;
          valueWithoutWhiteSpaces: boolean;
          valueToNumber: boolean;
          type: StringDataType | BooleanDataType;
          isValid: boolean;
          value: string | boolean;
          valueToLowerCase: boolean;
          name?: string;
          validateCallback: (
            id: string,
            value: string | boolean
          ) => Promise<{
            isValid: boolean;
            errorMessage: string | null;
          }>;
          formatting: ((value: string) => string) | undefined;
        }[];
      }[]
    >
  >,
  errorMessage: string | null,
  id: string,
  value: string | boolean,
  isValid: boolean
) => {
  const response = await new Promise<boolean>((resolve) => {
    setFormStatus((currentValue) => {
      const copiedCurrentValue = [...currentValue];

      let foundData = null as null | {
        id: string;
        errorMessage: string | null;
        placeholder: string;
        valueWithoutWhiteSpaces: boolean;
        valueToNumber: boolean;
        type: StringDataType | BooleanDataType;
        isValid: boolean;
        value: string | boolean;
        valueToLowerCase: boolean;
        name?: string;
        validateCallback: (
          id: string,
          value: string | boolean
        ) => Promise<{
          isValid: boolean;
          errorMessage: string | null;
        }>;
        formatting: ((value: string) => string) | undefined;
      };

      copiedCurrentValue.find((data) => {
        const foundDataLocal = data.data.find((data) => data.id === id);

        if (foundDataLocal) {
          foundData = foundDataLocal;

          return foundDataLocal;
        }
      })!;

      if (foundData !== null) {
        foundData.errorMessage = errorMessage;
        foundData.isValid = isValid;
        foundData.value = value;
      }

      setTimeout(() => {
        resolve(true);
      }, 10);

      return copiedCurrentValue;
    });
  });

  return response;
};

interface FormProps extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  children?: undefined;
  classNameForInlineInputs?: string;
}

const Form = ({ onSubmit, className, classNameForInlineInputs, ...rest }: FormProps) => {
  useSignals();

  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={(event) => {
        event.preventDefault();

        if (onSubmit) {
          onSubmit(event);
        }
      }}
      {...rest}>
      {formStatusSignal.value?.map(({ id, data }) => {
        return (
          <div key={id} className={`${classNameForInlineInputs}`}>
            {data.map(
              ({ id, placeholder, valueWithoutWhiteSpaces, type, validateCallback, errorMessage, value, valueToNumber, valueToLowerCase, formatting }) => {
                if (type === "textarea") {
                  return (
                    <Textarea
                      key={id}
                      placeholder={`${placeholder}`}
                      valueWithoutWhiteSpaces={valueWithoutWhiteSpaces}
                      errorMessage={errorMessage}
                      onInput={async (event) => {
                        const thisElement = event.currentTarget as HTMLDivElement;

                        await validateCallback(id, thisElement.innerText);

                        if (formatting) {
                          const formattedValue = formatting(thisElement.innerText);
                          thisElement.innerText = formattedValue;
                        }
                      }}
                      onBlur={(event) => {
                        const thisElement = event.currentTarget as HTMLDivElement;

                        validateCallback(id, thisElement.innerText);
                      }}></Textarea>
                  );
                } else if (type === "checkbox") {
                  return (
                    <CheckBox
                      key={id}
                      callback={async (value) => {
                        await validateCallback(id, value);
                      }}>
                      {placeholder}
                    </CheckBox>
                  );
                } else {
                  return (
                    <Input
                      key={id}
                      placeholder={placeholder}
                      valueWithoutWhiteSpaces={valueWithoutWhiteSpaces}
                      type={type}
                      valueToNumber={valueToNumber}
                      errorMessage={errorMessage}
                      value={value as string}
                      valueToLowerCase={valueToLowerCase}
                      onInput={async (event) => {
                        const thisElement = event.currentTarget as HTMLInputElement;

                        await validateCallback(id, thisElement.value);

                        if (formatting) {
                          const formattedValue = formatting(thisElement.value);
                          thisElement.value = formattedValue;
                        }
                      }}
                      onBlur={(event) => {
                        const thisElement = event.currentTarget as HTMLInputElement;

                        validateCallback(id, thisElement.value);
                      }}></Input>
                  );
                }
              }
            )}
          </div>
        );
      })}
      {submitButtonSignal.value}
    </form>
  );
};

type OtherValuesBasedOnGivenName<Value> = {
  [key: string]: {
    id: string;
    value: Value;
    isValid: boolean;
    setError?: (error: string) => void;
  };
};

type StringDataType = "text" | "password" | "textarea";
type BooleanDataType = "checkbox";
type FormDataFieldBasic = {
  placeholder: string;
  name: string;
  valueWithoutWhiteSpaces?: boolean;
  valueToNumber?: boolean;
  valueToLowerCase?: boolean;
};

type FormDataField =
  | ({
      type: StringDataType;
      validateCallback: (
        value: string,
        otherValues: OtherValuesBasedOnGivenName<string>
      ) =>
        | Promise<{
            isValid: boolean;
            errorMessage: string | null;
          }>
        | {
            isValid: boolean;
            errorMessage: string | null;
          };
      formatting?: (value: string) => string;
    } & FormDataFieldBasic)
  | ({
      type: BooleanDataType;
      validateCallback: (
        value: boolean,
        otherValues: OtherValuesBasedOnGivenName<boolean>
      ) =>
        | Promise<{
            isValid: boolean;
            errorMessage: string | null;
          }>
        | {
            isValid: boolean;
            errorMessage: string | null;
          };
      formatting: undefined;
    } & FormDataFieldBasic);

const useForm = (
  formData: FormDataField[][],
  SubmitButton: JSX.Element
): [({ onSubmit, className, classNameForInlineInputs, ...rest }: FormProps) => JSX.Element, OtherValuesBasedOnGivenName<string | boolean>] => {
  useSignals();

  const [formStatus, setFormStatus] = useState<
    {
      id: string;
      data: {
        id: string;
        errorMessage: string | null;
        placeholder: string;
        valueWithoutWhiteSpaces: boolean;
        valueToNumber: boolean;
        type: StringDataType | BooleanDataType;
        isValid: boolean;
        value: string | boolean;
        valueToLowerCase: boolean;
        name?: string;
        validateCallback: (
          id: string,
          value: string | boolean
        ) => Promise<{
          isValid: boolean;
          errorMessage: string | null;
        }>;
        formatting: ((value: string) => string) | undefined;
      }[];
    }[]
  >(
    formData.map((data) => {
      return {
        id: crypto.randomUUID(),
        data: data.map(
          ({ placeholder, type, valueWithoutWhiteSpaces, validateCallback, name, valueToNumber, valueToLowerCase, formatting: initialFormatting }) => {
            return {
              id: crypto.randomUUID(),
              errorMessage: null,
              placeholder: placeholder,
              valueToNumber: valueToNumber ? valueToNumber : false,
              valueWithoutWhiteSpaces: valueWithoutWhiteSpaces ? valueWithoutWhiteSpaces : true,
              type: type,
              name: name,
              isValid: false,
              value: "",
              valueToLowerCase: valueToLowerCase ? valueToLowerCase : false,
              formatting: initialFormatting
                ? (value: string) => {
                    const formattedString = initialFormatting(value);

                    return formattedString;
                  }
                : undefined,
              validateCallback: async (id, value) => {
                const formattedFormStatus: {
                  id: string;
                  name: string;
                  value: string | boolean;
                  isValid: boolean;
                }[] = [];

                formStatus.forEach((data) => {
                  data.data.forEach(({ name, value: valueLocal, id: idLocal, isValid }) => {
                    if (name) {
                      formattedFormStatus.push({
                        id: idLocal,
                        name: name,
                        value: id === idLocal ? value : valueLocal,
                        isValid: isValid,
                      });
                    }
                  });
                });

                const formattedFormStatusBasedOnName = formattedFormStatus.reduce<OtherValuesBasedOnGivenName<string | boolean>>((acc, data) => {
                  acc[data.name] = {
                    id: data.id,
                    value: data.value,
                    isValid: data.isValid,
                  };

                  return acc;
                }, {});

                //@ts-ignore
                const data = await validateCallback(value, formattedFormStatusBasedOnName);

                await setErrorStatusToFormStatusField(setFormStatus, data.errorMessage, id, value, data.isValid);

                return data;
              },
            };
          }
        ),
      };
    })
  );

  useEffect(() => {
    formStatusSignal.value = formStatus;

    submitButtonSignal.value = SubmitButton;
  }, [formData, SubmitButton]);

  const formattedFormStatus: {
    id: string;
    name: string;
    value: string | boolean;
    isValid: boolean;
  }[] = [];

  formStatus.forEach((data) => {
    data.data.forEach(({ name, value, id, isValid }) => {
      if (name) {
        formattedFormStatus.push({
          id: id,
          name: name,
          value: value,
          isValid: isValid,
        });
      }
    });
  });

  const formattedFormStatusBasedOnName = formattedFormStatus.reduce<OtherValuesBasedOnGivenName<string | boolean>>((acc, data) => {
    if (typeof data.value === "string") {
      acc[data.name] = {
        id: data.id,
        value: data.value as string,
        isValid: data.isValid,
        setError: (error: string) => {
          setErrorStatusToFormStatusField(setFormStatus, error, data.id, data.value, data.isValid);
        },
      };

      return acc as OtherValuesBasedOnGivenName<string>;
    } else {
      acc[data.name] = {
        id: data.id,
        value: data.value as boolean,
        isValid: data.isValid,
        setError: (error: string) => {
          setErrorStatusToFormStatusField(setFormStatus, error, data.id, data.value, data.isValid);
        },
      };

      return acc as OtherValuesBasedOnGivenName<boolean>;
    }
  }, {});

  return [Form, formattedFormStatusBasedOnName];
};

export { useForm };
