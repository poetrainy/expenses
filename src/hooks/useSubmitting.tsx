import { useNavigation, useRevalidator } from "react-router-dom";

export const useSubmitting = () => {
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  return {
    isSubmittingAndLoading:
      navigation.state === "submitting" ||
      navigation.state === "loading" ||
      revalidator.state === "loading",
    isSubmitting: navigation.state === "submitting",
    isLoading:
      navigation.state === "loading" || revalidator.state === "loading",
    isIdling: navigation.state === "idle" && revalidator.state === "idle",
  };
};
