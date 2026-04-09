import JustValidate from "just-validate";
import { getCurrentUser } from "../../services/auth";
import {
  createShippingAddress,
  createOrUpdateUserProfile,
  getShippingAddress,
  getUserProfile,
} from "../../services/profile";
import { Country, State } from "country-state-city";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { showToast } from "../../components/show-toast";

export async function initProfileAddress() {
  const form = document.querySelector<HTMLFormElement>('#profile-address-form');
  if (!form) return;

  function initPhoneFormatting(form: HTMLFormElement) {
    const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
    const countrySelect = form.querySelector('[data-select="country"] .cart-select__selected') as HTMLElement;

    if (!phoneInput) return;

    let isFormatting = false;

    const formatPhone = () => {
      if (isFormatting) return;
      isFormatting = true;

      const rawValue = phoneInput.value.trim();
      if (!rawValue) {
        isFormatting = false;
        return;
      }

      const countryCode = (countrySelect?.dataset.value || "US") as CountryCode;
      const cursorPosition = phoneInput.selectionStart;
      
      try {
        const parsedPhone = parsePhoneNumberFromString(rawValue, countryCode);
        
        if (parsedPhone && parsedPhone.isValid()) {
          const formatted = parsedPhone.formatInternational();
          if (phoneInput.value !== formatted) {
            phoneInput.value = formatted;
            
            const newPosition = Math.min(cursorPosition || 0, formatted.length);
            phoneInput.setSelectionRange(newPosition, newPosition);
          }
        }
      } catch (e) {
      }
      
      isFormatting = false;
    };

    phoneInput.addEventListener('input', formatPhone);
    
    if (countrySelect) {
      const observer = new MutationObserver(() => {
        formatPhone();
      });
      observer.observe(countrySelect, { 
        attributes: true, 
        attributeFilter: ['data-value', 'textContent'] 
      });
    }
  }

  function initLocalSelects(container: HTMLElement) {
    const countryEl = container.querySelector('[data-select="country"]') as HTMLElement;
    const stateEl = container.querySelector('[data-select="state"]') as HTMLElement;
    if (!countryEl || !stateEl) return;

    const countrySelected = countryEl.querySelector('.cart-select__selected') as HTMLElement;
    const countryDropdown = countryEl.querySelector('.cart-select__dropdown') as HTMLElement;

    const stateSelected = stateEl.querySelector('.cart-select__selected') as HTMLElement;
    const stateDropdown = stateEl.querySelector('.cart-select__dropdown') as HTMLElement;

    const countries = Country.getAllCountries();

    countryDropdown.innerHTML = countries.map(c => `
      <div class="cart-select__option" data-value="${c.isoCode}" data-name="${c.name}">
        ${c.name}
      </div>
    `).join("");

    countrySelected.addEventListener("click", (e) => {
      e.stopPropagation();
      stateEl.classList.remove("open");
      countryEl.classList.toggle("open");
    });

    stateSelected.addEventListener("click", (e) => {
      e.stopPropagation();
      countryEl.classList.remove("open");
      stateEl.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      countryEl.classList.remove("open");
      stateEl.classList.remove("open");
    });

    countryDropdown.addEventListener("click", (e) => {
      const option = (e.target as HTMLElement).closest(".cart-select__option") as HTMLElement;
      if (!option) return;

      const value = option.dataset.value!;
      const name = option.dataset.name!;

      countrySelected.textContent = name;
      countrySelected.dataset.value = value;
      countryEl.classList.remove("open");

      fillStates(value);
      
      const phoneInput = container.querySelector('[name="phone"]') as HTMLInputElement;
      if (phoneInput) {
        const inputEvent = new Event('input', { bubbles: true });
        phoneInput.dispatchEvent(inputEvent);
      }
    });

    stateDropdown.addEventListener("click", (e) => {
      const option = (e.target as HTMLElement).closest(".cart-select__option") as HTMLElement;
      if (!option) return;

      stateSelected.textContent = option.textContent!;
      stateSelected.dataset.value = option.dataset.value!;
      stateEl.classList.remove("open");
    });

    function fillStates(countryCode: string) {
      const states = State.getStatesOfCountry(countryCode);

      stateDropdown.innerHTML = states.map(s => `
        <div class="cart-select__option" data-value="${s.isoCode}" data-name="${s.name}">
          ${s.name}
        </div>
      `).join("");

      if (states.length > 0) {
        stateSelected.textContent = states[0].name;
        stateSelected.dataset.value = states[0].isoCode;
      } else {
        stateSelected.textContent = "Select state";
        stateSelected.dataset.value = "";
      }
    }

    const setCountryByName = (countryName: string) => {
      const country = countries.find(c => c.name === countryName);
      if (!country) return;

      countrySelected.textContent = country.name;
      countrySelected.dataset.value = country.isoCode;

      fillStates(country.isoCode);
    };

    const setStateByName = (stateName: string) => {
      const checkAndSet = () => {
        const options = stateDropdown.querySelectorAll('.cart-select__option');
        for (const option of options) {
          const optionEl = option as HTMLElement;
          if (optionEl.textContent?.trim() === stateName.trim()) {
            stateSelected.textContent = optionEl.textContent;
            stateSelected.dataset.value = optionEl.dataset.value!;
            return true;
          }
        }
        return false;
      };

      if (checkAndSet()) return;

      const observer = new MutationObserver(() => {
        if (checkAndSet()) observer.disconnect();
      });
      observer.observe(stateDropdown, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 1000);
    };

    return { setCountryByName, setStateByName };
  }

  try {
    const user = await getCurrentUser();

    if (!user) {
      window.location.href = '/login.html';
      return;
    }

    const [profile, address] = await Promise.all([
      getUserProfile(),
      getShippingAddress(),
    ]);

    const selectAPI = initLocalSelects(form);
    initPhoneFormatting(form);

    if (profile) {
      const firstNameInput = form.querySelector('[name="firstName"]') as HTMLInputElement;
      const lastNameInput = form.querySelector('[name="lastName"]') as HTMLInputElement;
      if (firstNameInput) firstNameInput.value = profile.first_name || '';
      if (lastNameInput) lastNameInput.value = profile.last_name || '';
    }

    if (address && selectAPI) {
      const street1Input = form.querySelector('[name="street1"]') as HTMLInputElement;
      const street2Input = form.querySelector('[name="street2"]') as HTMLInputElement;
      const zipInput = form.querySelector('[name="zip"]') as HTMLInputElement;
      const companyInput = form.querySelector('[name="company"]') as HTMLInputElement;
      const phoneInput = form.querySelector('[name="phone"]') as HTMLInputElement;
      const faxInput = form.querySelector('[name="fax"]') as HTMLInputElement;

      if (street1Input) street1Input.value = address.address || '';
      if (street2Input) street2Input.value = address.address2 || '';
      if (zipInput) zipInput.value = address.zip || '';
      if (companyInput) companyInput.value = address.company || '';
      if (faxInput) faxInput.value = address.fax || '';

      if (address.country) {
        selectAPI.setCountryByName(address.country);
      }
      
      if (address.state) {
        setTimeout(() => {
          selectAPI.setStateByName(address.state);
        }, 150);
      }

      if (phoneInput && address.phone) {
        phoneInput.value = address.phone;
        setTimeout(() => {
          const inputEvent = new Event('input', { bubbles: true });
          phoneInput.dispatchEvent(inputEvent);
        }, 200);
      }
    }

    const validator = new JustValidate(form, {
      errorFieldCssClass: "is-invalid",
    });

    validator
      .addField('[name="firstName"]', [
        { rule: "required", errorMessage: "First name is required" },
        {
          validator: (v: string) =>
            /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(v),
          errorMessage: "Only letters allowed",
        },
      ])
      .addField('[name="lastName"]', [
        { rule: "required", errorMessage: "Last name is required" },
        {
          validator: (v: string) =>
            /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(v),
          errorMessage: "Only letters allowed",
        },
      ])
      .addField('[name="zip"]', [
        {
          validator: (v: string) => !v || /^\d+$/.test(v),
          errorMessage: "ZIP must contain only numbers",
        },
      ])
      .addField('[name="street1"]', [
        { rule: "required", errorMessage: "Address is required" },
      ])
      .addField('[name="phone"]', [
        { rule: "required", errorMessage: "Phone is required" },
        {
          validator: (value: string) => {
            const countrySelected = form.querySelector(
              '[data-select="country"] .cart-select__selected'
            ) as HTMLElement;

            const countryCode = (countrySelected?.dataset.value || "US") as CountryCode;

            const phone = parsePhoneNumberFromString(value, countryCode);
            return phone ? phone.isValid() : false;
          },
          errorMessage: "Invalid phone number",
        },
      ]);

    validator.onSuccess(async (e: Event) => {
      e.preventDefault();

      const formData = new FormData(form);

      const countrySelected = form.querySelector(
        '[data-select="country"] .cart-select__selected'
      ) as HTMLElement;

      const stateSelected = form.querySelector(
        '[data-select="state"] .cart-select__selected'
      ) as HTMLElement;

      const countryName = countrySelected?.textContent?.trim() || "";
      const stateName = stateSelected?.textContent?.trim() || "";

      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        company: formData.get("company") as string || "",
        phone: formData.get("phone") as string,
        fax: formData.get("fax") as string || "",
        street1: formData.get("street1") as string,
        street2: formData.get("street2") as string || "",
        zip: formData.get("zip") as string,
        country: countryName,
        state: stateName,
      };

      let formattedPhone = data.phone;
      const countryForPhone = countrySelected?.dataset.value || "US";
      if (countryForPhone && data.phone) {
        const parsedPhone = parsePhoneNumberFromString(data.phone, countryForPhone as CountryCode);
        if (parsedPhone && parsedPhone.isValid()) {
          formattedPhone = parsedPhone.formatInternational();
        }
      }

      try {
        await createOrUpdateUserProfile({
          firstName: data.firstName,
          lastName: data.lastName,
        });

        await createShippingAddress({
          country: data.country,
          state: data.state,
          address: data.street1,
          address2: data.street2,
          zip: data.zip ? Number(data.zip) : undefined,
          phone: formattedPhone,
          company: data.company,
          fax: data.fax,
        });

        console.log("Address saved successfully");
        showToast("Address saved successfully", "success");
      } catch (err) {
        console.error("Save error:", err);
        showToast("Error saving address", "error");
      }
    });

  } catch (err) {
    console.error("Init profile address error:", err);
  }
}