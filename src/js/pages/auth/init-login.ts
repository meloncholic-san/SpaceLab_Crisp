import JustValidate from 'just-validate';
import { getCurrentUser, signIn } from '../../services/auth';

export async function initLogin() {
  const form = document.getElementById('login-form') as HTMLFormElement;
  if (!form) return;

  const validator = new JustValidate(form, {
    errorFieldCssClass: 'is-invalid',
  });

  try {
    const user = await getCurrentUser();
    if (user) {
      window.location.href = "./";
      return;
    }
  } catch (error) {
  }


  validator
    .addField('#email', [
      { rule: 'required' },
      { rule: 'email' },
    ])
    .addField('#password', [
      { rule: 'required' },
      { rule: 'minLength', value: 6 },
    ])
    .onSuccess(async (event: Event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      try {
        await signIn({ email, password });

        alert('Login successful');
        window.location.href = './';
      } catch (err: any) {
        alert(err.message || 'Login failed');
      }
    });
}