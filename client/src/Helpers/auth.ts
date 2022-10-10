interface IConfigParams {
  token: string;
}

export const getConfig = ({ token }: IConfigParams) => {
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
};
