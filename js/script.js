// script.js - Belal's Custom Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Trigger reading session for books in the library
    const readButtons = document.querySelectorAll('.btn-primary');
    
    readButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Starting your reading session! Happy learning, Belal.');
        });
    });

    // Trigger profile edit action
    const editBtn = document.getElementById('edit-profile-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
            console.log('Edit Profile Clicked');
            alert('Profile editing feature coming soon!');
        });
    }
});
