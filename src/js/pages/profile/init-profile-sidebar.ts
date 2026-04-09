import { signOut } from "../../services/auth";

export function initProfileSidebar() {
  const activeSection = document.querySelector<HTMLElement>('.profile__section[data-page]');
  const currentPage = activeSection?.dataset.page;
  
  if (!currentPage) return;
  
  const activeLink = document.querySelector<HTMLAnchorElement>(
    `.profile-sidebar__btn[data-page="${currentPage}"]`
  );
  
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  const signOutBtn = document.querySelector<HTMLButtonElement>('.profile-sidebar__btn.signout');
  signOutBtn?.addEventListener('click', async () => {
    await signOut();
    window.location.href = './';
  });
}