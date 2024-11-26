const keyExtractor = (value, index) => {
  return index.toString();
};

export const useFlatListHelpers = () => {
  return {
    keyExtractor,
  };
};