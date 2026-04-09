import JustValidate from 'just-validate';
import { getCurrentUser, signUp } from '../../services/auth';

type JustValidateFields = Record<
  string,
  { elem: HTMLInputElement }
>;

 function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'Weak';
  if (score <= 3) return 'Medium';
  return 'Strong';
}

export async function initRegister() {
  const form = document.getElementById('register-form') as HTMLFormElement;

  if (!form) return;

  try {
    const user = await getCurrentUser();
      if (user) {
        window.location.href = "./";
        return;
      }
    } catch (error) {
  }

  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const strengthText = document.getElementById('password-strength') as HTMLParagraphElement;

  if (passwordInput && strengthText) {
    passwordInput.addEventListener('input', () => {
      const value = passwordInput.value;

      if (!value) {
        strengthText.textContent = 'Password Strength: No Password';
        strengthText.className = 'register__password-strength';
        return;
      }

      const strength = getPasswordStrength(value);

      strengthText.textContent = `Password Strength: ${strength}`;
      strengthText.classList.remove('register__password-strength--weak','register__password-strength--medium','register__password-strength--strong');
      strengthText.classList.add(`register__password-strength--${strength.toLowerCase()}`);
    });
  }

  const validator = new JustValidate(form, {
    errorFieldCssClass: 'is-invalid',
  });

  validator
    .addField('#firstName', [
      {
        rule: 'required',
        errorMessage: 'First name is required',
      },
      {
        rule: 'minLength',
        value: 2,
      },
      {
        validator: (value: string) => {
          return /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(value);
        },
        errorMessage: 'First name must contain only letters',
      },
    ])
    .addField('#lastName', [
      {
        rule: 'required',
        errorMessage: 'Last name is required',
      },
      {
        rule: 'minLength',
        value: 2,
      },
      {
        validator: (value: string) => {
          return /^[A-Za-zА-Яа-яЁёЇїІіЄєҐґ\s]+$/.test(value);
        },
        errorMessage: 'First name must contain only letters',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
      },
      {
        rule: 'email',
      },
    ])
    .addField('#password', [
      {
        rule: 'required',
      },
      {
        rule: 'minLength',
        value: 6,
      },
    ])
    .addField('#confirmPassword', [
      {
        rule: 'required',
      },
      {
      validator: (value: string, fields: JustValidateFields) => {
        return value === fields['#password']?.elem?.value;
      },
        errorMessage: 'Passwords must match',
      },
    ])
    .onSuccess((event: Event) => {
      event.preventDefault();

      const formData = new FormData(form);
      
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      signUp({ firstName, lastName, email, password })
        .then(() => {
          alert('Registration successful! Check your email');
          form.reset();
        })
        .catch((err: Error) => {
          alert(err.message || 'Registration failed');
        });
    })
}