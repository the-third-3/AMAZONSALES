function toggleSubMenu(button) {
  const subMenu = button.nextElementSibling;
  if (subMenu) {
    subMenu.classList.toggle('show');
    button.classList.toggle('rotate');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-btn');
  const sidebar = document.getElementById('sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('close');
    });
  }
});