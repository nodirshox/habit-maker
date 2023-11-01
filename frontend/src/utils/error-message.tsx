interface ErrorType {
  code: string;
  message?: string;
  response?: {
    [key: string]: any;
  };
}

export default function ErrorMessage(error: ErrorType) {
  return error.response
    ? `${error.code}, ${JSON.stringify(error.response)}`
    : `${error.code}, ${error.message}`;
}
