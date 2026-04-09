import JustValidate from "just-validate";
import { showToast } from "../../components/show-toast";
import { subscribeToNewsletter } from "../../services/subscriptions";

export function initFooter() {
  const form = document.getElementById("subscribe-form") as HTMLFormElement;
  
  if (!form) return;

  const validator = new JustValidate(form, {
    errorFieldCssClass: "is-invalid",
  });

  validator.addField("#subscribe-email", [
    {
      rule: "required",
      errorMessage: "Email is required",
    },
    {
      rule: "email",
      errorMessage: "Please enter a valid email address",
    },
  ]);

  validator.onSuccess(async (event: Event) => {
    event.preventDefault();

    const emailInput = form.querySelector("#subscribe-email") as HTMLInputElement;
    const submitBtn = form.querySelector("button[type='submit']") as HTMLButtonElement;
    
    const email = emailInput.value.trim();

    const originalText = submitBtn?.textContent || "Subscribe!";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Subscribing...";
    }

    const result = await subscribeToNewsletter(email);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }

    if (result.success) {
      if (result.message === "subscribed") {
        showToast("Successfully subscribed to our newsletter!", "success");
      } else if (result.message === "resubscribed") {
        showToast("Welcome back! You've been resubscribed!", "success");
      }
      emailInput.value = "";
    } else {
      if (result.message === "already_subscribed") {
        showToast("This email is already subscribed to our newsletter!", "warning");
      } else {
        showToast(result.message || "Something went wrong. Please try again.", "error");
      }
    }
  });
}