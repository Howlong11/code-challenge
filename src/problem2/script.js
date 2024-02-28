window.onload = () => {
    // Function to toggle dropdown visibility
    const dropdown = (dropdownContent) => {
      dropdownContent.classList.toggle('show');
    }
  
    // Function to handle currency selection
    const show = (value, dropdownContent) => {
      const dropbtn_icon = dropdownContent.previousElementSibling.querySelector('.dropbtn_icon');
      const dropbtn_content = dropdownContent.previousElementSibling.querySelector('.dropbtn_content');
  
      dropbtn_icon.innerText = '';
      dropbtn_content.innerText = value;
      dropbtn_content.style.color = '#252525';
    }
  
    // Event listener for dropdown buttons
    const dropdownButtons = document.querySelectorAll('.dropbtn_click');
    dropdownButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dropdownContent = button.parentElement.nextElementSibling;
        dropdown(dropdownContent);
      });
    });
  
    // Event listener for dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-content div');
    dropdownItems.forEach(item => {
      item.addEventListener('click', () => {
        const dropdownContent = item.parentElement;
        show(item.innerText, dropdownContent);
        dropdown(dropdownContent);
      });
    });
  
    // Close dropdowns when clicking outside
    window.onclick = (e) => {
      const dropdowns = document.querySelectorAll(".dropdown-content");
      dropdowns.forEach(dropdownContent => {
        if (!e.target.matches('.dropbtn_click') && !dropdownContent.contains(e.target)) {
          dropdownContent.classList.remove('show');
        }
      });
    }
  }
  