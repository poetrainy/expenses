import { useNavigation } from "react-router-dom";

export const useSubmitting = () => {
  const navigation = useNavigation();

  return navigation.state === "submitting" || navigation.state === "loading";
};
