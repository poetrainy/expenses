import { useNavigation } from "react-router-dom";

export const useSubmitting = () => {
  const navigation = useNavigation();

  return {
    isSubmittingAndLoading:
      navigation.state === "submitting" || navigation.state === "loading",
    isSubmitting: navigation.state === "submitting",
    isLoading: navigation.state === "loading",
  };
};
