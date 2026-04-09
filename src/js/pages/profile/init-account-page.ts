import JustValidate from "just-validate";

import {
  getUserProfile,
  createOrUpdateUserProfile,
  updateUserEmail,
  updateUserPassword,
} from "../../services/profile";
import { showToast } from "../../components/show-toast";

export function initProfileAccount() {
  const form = document.querySelector<HTMLFormElement>("#profile-account-form");
  if (!form) return;

  const emailToggle = document.getElementById("change-email-toggle") as HTMLInputElement;
  const passwordToggle = document.getElementById("change-password-toggle") as HTMLInputElement;

  const emailField = document.getElementById("email-field") as HTMLElement;
  const passwordField = document.getElementById("password-field") as HTMLElement;

  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]')!;
  const firstNameInput = form.querySelector<HTMLInputElement>('input[name="firstName"]')!;
  const lastNameInput = form.querySelector<HTMLInputElement>('input[name="lastName"]')!;

    function syncToggleState() {
    emailField.classList.toggle("is-hidden", !emailToggle.checked);
    passwordField.classList.toggle("is-hidden", !passwordToggle.checked);
    }
    
    syncToggleState();

    emailToggle.addEventListener("change", syncToggleState);
    passwordToggle.addEventListener("change", syncToggleState);


  (async () => {
    try {
      const profile = await getUserProfile();

      if (profile) {
        firstNameInput.value = profile.first_name || "";
        lastNameInput.value = profile.last_name || "";
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  })();

  
  const validator = new JustValidate(form, {
    errorFieldCssClass: "is-invalid",
  });

  validator
    .addField(firstNameInput, [
      {
        rule: "required",
        errorMessage: "First name is required",
      },
    ])
    .addField(lastNameInput, [
      {
        rule: "required",
        errorMessage: "Last name is required",
      },
    ])
    .addField(emailInput, [
      {
        validator: () => {
          if (!emailToggle.checked) return true;
          return emailInput.value.trim().length > 0;
        },
        errorMessage: "Email is required",
      },
      {
        validator: () => {
          if (!emailToggle.checked) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        },
        errorMessage: "Invalid email",
      },
    ])
    .addField(passwordInput, [
      {
        validator: () => {
          if (!passwordToggle.checked) return true;
          return passwordInput.value.trim().length > 0;
        },
        errorMessage: "Password is required",
      },
      {
        validator: () => {
          if (!passwordToggle.checked) return true;
          return passwordInput.value.length >= 6;
        },
        errorMessage: "Minimum 6 characters",
      },
    ]);

  validator.onSuccess(async (e: Event) => {
    e.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      await createOrUpdateUserProfile({
        firstName,
        lastName,
      });
      if (emailToggle.checked) {
        await updateUserEmail(email);
      }
      if (passwordToggle.checked) {
        await updateUserPassword(password);
      }

      showToast("Account updated successfully", "success");

      emailToggle.checked = false;
      passwordToggle.checked = false;
      emailField.classList.add("is-hidden");
      passwordField.classList.add("is-hidden");

      emailInput.value = "";
      passwordInput.value = "";

    } catch (err) {
    showToast("Update failed", "error");
    }
  });
}