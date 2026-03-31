// Simple interaction logic for Library and Profile
document.addEventListener('DOMContentLoaded', () => {
    // Select all "Read Now" buttons
    const readButtons = document.querySelectorAll('.book-card button');
    
    readButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Starting your reading session! Happy learning.');
        });
    });

    // Profile page interaction
    const editBtn = document.getElementById('edit-profile-btn');
    if(editBtn) {
        editBtn.addEventListener('click', () => {
            console.log('Edit Profile Clicked');
            alert('Profile editing feature coming soon!');
        });
    }
});